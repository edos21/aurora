import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import type { Asset, AssetResponse, AssetCreate, AssetSearch } from '@/types'

// Query Keys
export const assetKeys = {
  all: ['assets'] as const,
  lists: () => [...assetKeys.all, 'list'] as const,
  list: (search?: AssetSearch) => [...assetKeys.lists(), search] as const,
  details: () => [...assetKeys.all, 'detail'] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const,
}

// Assets List Hook
export function useAssets(searchParams?: AssetSearch) {
  return useQuery({
    queryKey: assetKeys.list(searchParams),
    queryFn: () => {
      const params: Record<string, string> = {}

      if (searchParams?.search) params.search = searchParams.search
      if (searchParams?.asset_type) params.asset_type = searchParams.asset_type
      if (searchParams?.classification)
        params.classification = searchParams.classification
      if (searchParams?.limit) params.limit = searchParams.limit.toString()

      return apiClient
        .get<{
          assets: AssetResponse[]
          total: number
          limit: number
          offset: number
        }>(
          API_ENDPOINTS.ASSETS,
          Object.keys(params).length > 0 ? params : undefined
        )
        .then(response => response.assets || [])
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - assets don't change often
    retry: 2,
  })
}

// Asset Detail Hook
export function useAsset(id: string) {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => apiClient.get<AssetResponse>(API_ENDPOINTS.ASSET_BY_ID(id)),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
}

// Create Asset Mutation
export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssetCreate) =>
      apiClient.post<AssetResponse>(API_ENDPOINTS.ASSETS, data),
    onSuccess: newAsset => {
      // Invalidate assets list
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })

      // Set the new asset in cache
      queryClient.setQueryData(assetKeys.detail(newAsset.id), newAsset)

      // Also invalidate portfolio since new asset affects holdings
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

// Update Asset Mutation
export function useUpdateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetCreate> }) =>
      apiClient.put<AssetResponse>(API_ENDPOINTS.ASSET_BY_ID(id), data),
    onSuccess: (updatedAsset, { id }) => {
      // Update asset in cache
      queryClient.setQueryData(assetKeys.detail(id), updatedAsset)

      // Invalidate assets list
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })

      // Invalidate portfolio in case asset name or type changed
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

// Delete Asset Mutation
export function useDeleteAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(API_ENDPOINTS.ASSET_BY_ID(id)),
    onSuccess: (_, id) => {
      // Remove asset from cache
      queryClient.removeQueries({ queryKey: assetKeys.detail(id) })

      // Invalidate assets list
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })

      // Invalidate portfolio since deletion affects holdings
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    },
  })
}

// Search Assets Hook (for autocomplete/search components)
export function useSearchAssets(
  query: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: assetKeys.list({ search: query, limit: 10 }),
    queryFn: () =>
      apiClient.get<AssetResponse[]>(API_ENDPOINTS.ASSETS, {
        search: query,
        limit: '10',
      }),
    enabled: (options?.enabled ?? true) && query.length >= 2, // Only search with 2+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
