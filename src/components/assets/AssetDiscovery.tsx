'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AssetSearch } from './AssetSearch'
import { AssetConfirmation } from './AssetConfirmation'
import { apiClient, API_ENDPOINTS } from '@/lib/api'
import { toast } from 'sonner'

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

interface CustomAssetData {
  ticker: string
  name: string
  asset_type: string
  classification: string
  currency: string
  notes?: string
}

type DiscoveryStep = 'search' | 'confirmation'

interface AssetDiscoveryProps {
  onAssetSelected: (asset: AssetSearchResult | CustomAssetData) => void
  onCancel: () => void
  className?: string
}

export function AssetDiscovery({
  onAssetSelected,
  onCancel,
  className,
}: AssetDiscoveryProps) {
  const [currentStep, setCurrentStep] = useState<DiscoveryStep>('search')
  const [selectedAsset, setSelectedAsset] = useState<AssetSearchResult | null>(
    null
  )
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAssetSelect = (asset: AssetSearchResult) => {
    setSelectedAsset(asset)
    setCurrentStep('confirmation')
  }

  const handleAssetConfirm = async (asset: AssetSearchResult) => {
    // Check if this is a UUID (our internal ID) or an external ID
    const isInternalId =
      asset.id &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        asset.id
      )

    setIsProcessing(true)
    try {
      // If it's an external asset without our internal UUID, we need to create it first
      if (asset.external_id && !isInternalId) {
        await createExternalAsset(asset)
        // Update the asset with the new ID
        const updatedAsset = { ...asset, id: selectedAsset?.id }
        onAssetSelected(updatedAsset)
      } else {
        // Asset already exists in our DB
        onAssetSelected(asset)
      }
    } catch (error) {
      console.error('Error confirming asset:', error)
      toast.error('Error al confirmar el asset. Intenta de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBackToSearch = () => {
    setCurrentStep('search')
    setSelectedAsset(null)
  }

  const createExternalAsset = async (
    asset: AssetSearchResult
  ): Promise<void> => {
    try {
      const assetData = {
        ticker: asset.ticker,
        name: asset.name,
        asset_type: asset.asset_type,
        classification: asset.classification,
        currency: asset.currency,
        source: asset.source,
        external_id: asset.external_id,
        is_popular: asset.is_popular,
        popularity_rank: asset.popularity_rank,
        sync_frequency_hours: 12, // Default sync every 12 hours
      }

      const createdAsset = await apiClient.post(API_ENDPOINTS.ASSETS, assetData)

      // Update the asset with the new ID from response
      setSelectedAsset({ ...asset, id: (createdAsset as any).id })
      toast.success(`Asset "${asset.ticker}" creado exitosamente`)
    } catch (error) {
      console.error('Error creating external asset:', error)
      toast.error('Error al crear el asset. Intenta de nuevo.')
      throw error
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'search':
        return <AssetSearch onAssetSelect={handleAssetSelect} />

      case 'confirmation':
        if (!selectedAsset) {
          return (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se pudo cargar la información del asset. Por favor, intenta
                de nuevo.
              </AlertDescription>
            </Alert>
          )
        }

        return (
          <AssetConfirmation
            asset={selectedAsset}
            onConfirm={handleAssetConfirm}
            onCancel={handleBackToSearch}
          />
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'search':
        return 'Descubrir Assets'
      case 'confirmation':
        return 'Confirmar Asset'
      default:
        return 'Asset Discovery'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'search':
        return 'Busca assets existentes, populares o crea uno personalizado'
      case 'confirmation':
        return 'Revisa los detalles del asset antes de confirmarlo'
      default:
        return ''
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentStep !== 'search' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSearch}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <div>
            <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
            <p className="text-muted-foreground">{getStepDescription()}</p>
          </div>
        </div>

        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-2">
        <div
          className={`flex items-center space-x-2 ${
            currentStep === 'search' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'search'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            1
          </div>
          <span className="text-sm font-medium">Búsqueda</span>
        </div>

        <div className="bg-muted h-px w-8" />

        <div
          className={`flex items-center space-x-2 ${
            currentStep === 'confirmation'
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              currentStep === 'confirmation'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium">Confirmación</span>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderStepContent()}</div>

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <Card className="w-96">
            <CardContent className="p-6 text-center">
              <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
              <p className="text-lg font-medium">Procesando...</p>
              <p className="text-muted-foreground text-sm">
                {currentStep === 'confirmation'
                  ? 'Creando asset...'
                  : 'Guardando asset personalizado...'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
