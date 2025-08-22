import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import type {
  Transaction,
  TransactionResponse,
  TransactionCreate,
  TransactionSearch,
} from '@/types'

// Query Keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (search?: TransactionSearch) =>
    [...transactionKeys.lists(), search] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
}

// Transactions List Hook
export function useTransactions(searchParams?: TransactionSearch) {
  return useQuery({
    queryKey: transactionKeys.list(searchParams),
    queryFn: () => {
      const params: Record<string, string> = {}

      if (searchParams?.asset_id) params.asset_id = searchParams.asset_id
      if (searchParams?.from) params.from = searchParams.from
      if (searchParams?.to) params.to = searchParams.to
      if (searchParams?.type) params.type = searchParams.type
      if (searchParams?.limit) params.limit = searchParams.limit.toString()

      return apiClient
        .get<{
          transactions: TransactionResponse[]
          total: number
          limit: number
          offset: number
        }>(
          API_ENDPOINTS.TRANSACTIONS,
          Object.keys(params).length > 0 ? params : undefined
        )
        .then(response => response.transactions || [])
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })
}

// Transaction Detail Hook
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () =>
      apiClient.get<TransactionResponse>(API_ENDPOINTS.TRANSACTION_BY_ID(id)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes - transactions are historical
    retry: 2,
  })
}

// Create Transaction Mutation
export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransactionCreate) =>
      apiClient.post<TransactionResponse>(API_ENDPOINTS.TRANSACTIONS, data),
    onSuccess: newTransaction => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })

      // Set the new transaction in cache
      queryClient.setQueryData(
        transactionKeys.detail(newTransaction.id),
        newTransaction
      )

      // Invalidate portfolio since new transaction affects holdings
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })

      // Invalidate asset-specific transaction lists
      if (newTransaction.asset_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.list({ asset_id: newTransaction.asset_id }),
        })
      }
    },
  })
}

// Update Transaction Mutation
export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<TransactionCreate>
    }) =>
      apiClient.put<TransactionResponse>(
        API_ENDPOINTS.TRANSACTION_BY_ID(id),
        data
      ),
    onSuccess: (updatedTransaction, { id }) => {
      // Update transaction in cache
      queryClient.setQueryData(transactionKeys.detail(id), updatedTransaction)

      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })

      // Invalidate portfolio since transaction change affects holdings
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })

      // Invalidate asset-specific transaction lists
      if (updatedTransaction.asset_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.list({
            asset_id: updatedTransaction.asset_id,
          }),
        })
      }
    },
  })
}

// Delete Transaction Mutation
export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(API_ENDPOINTS.TRANSACTION_BY_ID(id)),
    onSuccess: (_, id) => {
      // Remove transaction from cache
      queryClient.removeQueries({ queryKey: transactionKeys.detail(id) })

      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })

      // Invalidate portfolio since deletion affects holdings
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

// Recent Transactions Hook (for dashboard)
export function useRecentTransactions(limit = 5) {
  return useQuery({
    queryKey: transactionKeys.list({ limit }),
    queryFn: () =>
      apiClient
        .get<{
          transactions: TransactionResponse[]
          total: number
          limit: number
          offset: number
        }>(API_ENDPOINTS.TRANSACTIONS, { limit: limit.toString() })
        .then(response => response.transactions || []),
    staleTime: 2 * 60 * 1000, // 2 minutes for recent data
    retry: 2,
  })
}

// Asset Transactions Hook (for asset detail page)
export function useAssetTransactions(assetId: string) {
  return useQuery({
    queryKey: transactionKeys.list({ asset_id: assetId }),
    queryFn: () =>
      apiClient
        .get<{
          transactions: TransactionResponse[]
          total: number
          limit: number
          offset: number
        }>(API_ENDPOINTS.TRANSACTIONS, { asset_id: assetId })
        .then(response => response.transactions || []),
    enabled: !!assetId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
