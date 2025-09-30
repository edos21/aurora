import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import type {
  PortfolioSummary,
  PortfolioHoldings,
  PortfolioSearch,
  AllocationByType,
  AllocationByClassification,
} from '@/types'

// Query Keys
export const portfolioKeys = {
  all: ['portfolio'] as const,
  summary: (currency = 'USD') =>
    [...portfolioKeys.all, 'summary', currency] as const,
  holdings: (search?: PortfolioSearch) =>
    [...portfolioKeys.all, 'holdings', search] as const,
  allocation: (groupBy: 'type' | 'classification' = 'type') =>
    [...portfolioKeys.all, 'allocation', groupBy] as const,
}

// Portfolio Summary Hook
export function usePortfolioSummary(baseCurrency = 'USD') {
  return useQuery({
    queryKey: portfolioKeys.summary(baseCurrency),
    queryFn: () =>
      apiClient.get<PortfolioSummary>(
        API_ENDPOINTS.PORTFOLIO_SUMMARY,
        baseCurrency !== 'USD' ? { base_currency: baseCurrency } : undefined
      ),
    staleTime: 2 * 60 * 1000, // 2 minutes for summary
    retry: 2,
  })
}

// Portfolio Holdings Hook
export function usePortfolioHoldings(searchParams?: PortfolioSearch) {
  return useQuery({
    queryKey: portfolioKeys.holdings(searchParams),
    queryFn: () => {
      const params: Record<string, string> = {}

      if (searchParams?.asset_type) params.asset_type = searchParams.asset_type
      if (searchParams?.classification)
        params.classification = searchParams.classification
      if (searchParams?.min_allocation_pct)
        params.min_allocation_pct = searchParams.min_allocation_pct.toString()
      if (searchParams?.only_active !== undefined)
        params.only_active = searchParams.only_active.toString()

      return apiClient.get<PortfolioHoldings>(
        API_ENDPOINTS.PORTFOLIO_HOLDINGS,
        Object.keys(params).length > 0 ? params : undefined
      )
    },
    staleTime: 3 * 60 * 1000, // 3 minutes for holdings
    retry: 2,
  })
}

// Portfolio Allocation Hook
export function usePortfolioAllocation(
  groupBy: 'type' | 'classification' = 'type'
) {
  return useQuery({
    queryKey: portfolioKeys.allocation(groupBy),
    queryFn: async () => {
      const holdings = await apiClient.get<PortfolioHoldings>(
        API_ENDPOINTS.PORTFOLIO_HOLDINGS
      )
      return groupBy === 'type'
        ? holdings.summary.allocation_by_type
        : holdings.summary.allocation_by_classification
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for allocation
    retry: 2,
  })
}

// Invalidate all portfolio queries
export function useInvalidatePortfolio() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
  }
}
