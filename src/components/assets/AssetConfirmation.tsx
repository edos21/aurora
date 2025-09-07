'use client'

import { useState } from 'react'
import { Check, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

interface AssetConfirmationProps {
  asset: AssetSearchResult
  onConfirm: (asset: AssetSearchResult) => void
  onCancel: () => void
  onCustomAsset: () => void
}

export function AssetConfirmation({
  asset,
  onConfirm,
  onCancel,
  onCustomAsset,
}: AssetConfirmationProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm(asset)
    } catch (error) {
      console.error('Error confirming asset:', error)
      throw error
    } finally {
      setIsConfirming(false)
    }
  }

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

  // Check if this is a UUID (our internal ID) or an external ID
  const isInternalId =
    asset.id &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      asset.id
    )
  const isExistingAsset = isInternalId
  const isExternalAsset = !!asset.external_id && !isInternalId

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Asset Encontrado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Asset Details */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-3 flex items-center space-x-2">
                <span className="text-2xl font-bold">{asset.ticker}</span>
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
                    Popular
                  </Badge>
                )}
                <span className="text-muted-foreground text-sm">
                  {getSourceIcon(asset.source)} {asset.source}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-medium">{asset.name}</h3>

              <div className="text-muted-foreground mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Clasificación:</span>{' '}
                  {asset.classification}
                </div>
                <div>
                  <span className="font-medium">Moneda:</span> {asset.currency}
                </div>
                {asset.popularity_rank && (
                  <div>
                    <span className="font-medium">Ranking:</span> #
                    {asset.popularity_rank}
                  </div>
                )}
                {asset.external_id && (
                  <div>
                    <span className="font-medium">ID Externo:</span>{' '}
                    {asset.external_id}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-right">
              {asset.current_price_usd && (
                <div className="text-2xl font-bold">
                  {formatPrice(asset.current_price_usd)}
                </div>
              )}
              {asset.price_change_24h && (
                <div
                  className={`text-lg ${
                    asset.price_change_24h >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {formatPercentage(asset.price_change_24h)}
                </div>
              )}
              {asset.market_cap && (
                <div className="text-muted-foreground text-sm">
                  MC:{' '}
                  {new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(asset.market_cap)}
                </div>
              )}
            </div>
          </div>

          {/* Status Alerts */}
          {isExistingAsset && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Este asset ya existe en tu base de datos. Puedes usarlo
                directamente.
              </AlertDescription>
            </Alert>
          )}

          {isExternalAsset && !isExistingAsset && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Este asset proviene de {asset.source}. Se creará automáticamente
                en tu base de datos.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isConfirming}
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={onCustomAsset}
                disabled={isConfirming}
              >
                Crear Personalizado
              </Button>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="min-w-[120px]"
            >
              {isConfirming
                ? 'Confirmando...'
                : isExistingAsset
                  ? 'Usar Asset'
                  : 'Crear Asset'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
