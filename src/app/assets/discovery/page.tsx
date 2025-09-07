'use client'

import { useState } from 'react'
import {
  AssetDiscovery,
  AssetSearchResult,
  CustomAssetData,
} from '@/components/assets'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AssetDiscoveryPage() {
  const [selectedAsset, setSelectedAsset] = useState<
    AssetSearchResult | CustomAssetData | null
  >(null)
  const [showDiscovery, setShowDiscovery] = useState(true)

  const handleAssetSelected = (asset: AssetSearchResult | CustomAssetData) => {
    setSelectedAsset(asset)
    setShowDiscovery(false)
  }

  const handleBackToDiscovery = () => {
    setShowDiscovery(true)
    setSelectedAsset(null)
  }

  const handleCancel = () => {
    // Navigate back to assets page
    window.history.back()
  }

  if (showDiscovery) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/assets"
            className="text-muted-foreground hover:text-foreground inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Assets
          </Link>
        </div>

        <AssetDiscovery
          onAssetSelected={handleAssetSelected}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  if (selectedAsset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToDiscovery}
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Discovery
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>✅ Asset Seleccionado</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Ticker
                </label>
                <p className="text-lg font-semibold">{selectedAsset.ticker}</p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Nombre
                </label>
                <p className="text-lg font-semibold">{selectedAsset.name}</p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Tipo
                </label>
                <p className="text-lg font-semibold">
                  {selectedAsset.asset_type}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Clasificación
                </label>
                <p className="text-lg font-semibold">
                  {selectedAsset.classification}
                </p>
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Moneda
                </label>
                <p className="text-lg font-semibold">
                  {selectedAsset.currency}
                </p>
              </div>

              {'source' in selectedAsset && (
                <div>
                  <label className="text-muted-foreground text-sm font-medium">
                    Fuente
                  </label>
                  <p className="text-lg font-semibold">
                    {selectedAsset.source}
                  </p>
                </div>
              )}
            </div>

            {'external_id' in selectedAsset && selectedAsset.external_id && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  ID Externo
                </label>
                <p className="text-lg font-semibold">
                  {selectedAsset.external_id}
                </p>
              </div>
            )}

            {'notes' in selectedAsset && selectedAsset.notes && (
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Notas
                </label>
                <p className="text-lg font-semibold">{selectedAsset.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-muted-foreground text-sm">
                El asset ha sido seleccionado exitosamente.
                {'source' in selectedAsset && selectedAsset.source === 'manual'
                  ? ' Es un asset personalizado que no tendrá precios automáticos.'
                  : ' Se sincronizará automáticamente con la fuente de datos externa.'}
              </p>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleBackToDiscovery} variant="outline">
                Seleccionar Otro Asset
              </Button>
              <Button asChild>
                <Link href="/assets">Ir a Assets</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
