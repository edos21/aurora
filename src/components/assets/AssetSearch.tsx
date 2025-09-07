'use client'

import { useState, useCallback, useMemo } from 'react'
import { Search, TrendingUp, Database, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api'

interface AssetSearchResult {
  id?: string
  ticker: string
  name: string
  asset_type: string
  classification: string
  currency: string
  source: string
  external_id?: string
  is_popular: boolean
  popularity_rank?: number
  current_price_usd?: number
  price_change_24h?: number
  volume_24h?: number
  market_cap?: number
}

interface AssetSearchProps {
  onAssetSelect: (asset: AssetSearchResult) => void
  onCustomAsset: () => void
  className?: string
}

export function AssetSearch({
  onAssetSelect,
  onCustomAsset,
  className,
}: AssetSearchProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'existing' | 'popular'>(
    'all'
  )

  // Search existing assets
  const { data: existingAssets, isLoading: existingLoading } = useQuery({
    queryKey: ['assets', 'search', query, 'existing'],
    queryFn: async (): Promise<AssetSearchResult[]> => {
      if (!query || query.length < 2) return []

      const response = await apiClient.get(`/api/v1/assets/search`, {
        query: query,
        limit: '20',
      })
      return Array.isArray(response) ? response : []
    },
    enabled:
      query.length >= 2 && (searchType === 'all' || searchType === 'existing'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get popular assets
  const { data: popularAssets, isLoading: popularLoading } = useQuery({
    queryKey: ['assets', 'popular', 'crypto'],
    queryFn: async (): Promise<AssetSearchResult[]> => {
      const response = await apiClient.get(`/api/v1/assets/popular`, {
        asset_type: 'CRYPTO',
        limit: '50',
      })
      return Array.isArray(response) ? response : []
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: searchType === 'all' || searchType === 'popular',
  })

  // Filter and combine results
  const searchResults = useMemo(() => {
    const results: AssetSearchResult[] = []

    // Add existing assets first
    if (
      Array.isArray(existingAssets) &&
      (searchType === 'all' || searchType === 'existing')
    ) {
      results.push(...existingAssets)
    }

    // Add popular assets that match query
    if (
      Array.isArray(popularAssets) &&
      (searchType === 'all' || searchType === 'popular')
    ) {
      const matchingPopular = popularAssets.filter(
        (asset: AssetSearchResult) => {
          if (!query) return true
          return (
            asset.ticker.toLowerCase().includes(query.toLowerCase()) ||
            asset.name.toLowerCase().includes(query.toLowerCase())
          )
        }
      )
      results.push(...matchingPopular)
    }

    // Remove duplicates (prioritize existing assets)
    const seen = new Set()
    return results.filter(asset => {
      const key = asset.ticker.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [existingAssets, popularAssets, searchType, query])

  const handleAssetSelect = useCallback(
    (asset: AssetSearchResult) => {
      onAssetSelect(asset)
    },
    [onAssetSelect]
  )

  const formatPrice = (price?: number | string) => {
    if (!price) return 'N/A'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(numPrice)
  }

  const formatPercentage = (percentage?: number | string) => {
    if (!percentage) return 'N/A'
    const numPercentage =
      typeof percentage === 'string' ? parseFloat(percentage) : percentage
    if (isNaN(numPercentage)) return 'N/A'
    const sign = numPercentage >= 0 ? '+' : ''
    return `${sign}${numPercentage.toFixed(2)}%`
  }

  const getAssetTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CRYPTO':
        return 'bg-orange-100 text-orange-800'
      case 'STOCK':
        return 'bg-blue-100 text-blue-800'
      case 'ETF':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'coingecko':
        return '🪙'
      case 'yfinance':
        return '📈'
      default:
        return '💼'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="text-muted-foreground h-5 w-5" />
          <h3 className="text-lg font-semibold">Buscar Assets</h3>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCustomAsset}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Asset Personalizado</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="Buscar por ticker o nombre (ej: BTC, Bitcoin, AAPL)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      </div>

      {/* Search Type Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={searchType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchType('all')}
        >
          Todos
        </Button>
        <Button
          variant={searchType === 'existing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchType('existing')}
        >
          <Database className="mr-2 h-4 w-4" />
          Existentes
        </Button>
        <Button
          variant={searchType === 'popular' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSearchType('popular')}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Populares
        </Button>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {query.length < 2 && searchType === 'all' && (
          <div className="text-muted-foreground py-8 text-center">
            <TrendingUp className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <p className="text-lg font-medium">Assets Populares</p>
            <p className="text-sm">Los assets más populares aparecerán aquí</p>
          </div>
        )}

        {query.length >= 2 && (existingLoading || popularLoading) && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((asset, index) => (
              <Card
                key={`${asset.ticker}-${index}`}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => handleAssetSelect(asset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-lg font-semibold">
                          {asset.ticker}
                        </span>
                        <Badge
                          variant="secondary"
                          className={getAssetTypeColor(asset.asset_type)}
                        >
                          {asset.asset_type}
                        </Badge>
                        {asset.is_popular && (
                          <Badge
                            variant="default"
                            className="bg-orange-100 text-orange-800"
                          >
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Popular
                          </Badge>
                        )}
                        <span className="text-muted-foreground text-sm">
                          {getSourceIcon(asset.source)} {asset.source}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-2 text-sm">
                        {asset.name}
                      </p>

                      <div className="text-muted-foreground flex items-center space-x-4 text-xs">
                        <span>Clasificación: {asset.classification}</span>
                        <span>Moneda: {asset.currency}</span>
                        {asset.popularity_rank && (
                          <span>Rank: #{asset.popularity_rank}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-right">
                      {asset.current_price_usd && (
                        <div className="text-lg font-semibold">
                          {formatPrice(asset.current_price_usd)}
                        </div>
                      )}
                      {asset.price_change_24h && (
                        <div
                          className={`text-sm ${
                            asset.price_change_24h >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {formatPercentage(asset.price_change_24h)}
                        </div>
                      )}
                      {asset.market_cap && (
                        <div className="text-muted-foreground text-xs">
                          MC:{' '}
                          {new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1,
                          }).format(asset.market_cap)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {query.length >= 2 &&
          !existingLoading &&
          !popularLoading &&
          searchResults.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              <Search className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
              <p className="text-lg font-medium">No se encontraron assets</p>
              <p className="text-sm">
                Intenta con otro término de búsqueda o crea un asset
                personalizado
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
