'use client'

import { useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Coins, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAssets } from '@/hooks/useAssets'
import { cn } from '@/lib/utils'
import type { AssetType, AssetClassification } from '@/types'

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssetType | 'ALL'>('ALL')
  const [classificationFilter, setClassificationFilter] = useState<
    AssetClassification | 'ALL'
  >('ALL')

  const {
    data: assets,
    isLoading,
    error,
  } = useAssets({
    search: searchTerm || undefined,
    asset_type: typeFilter !== 'ALL' ? typeFilter : undefined,
    classification:
      classificationFilter !== 'ALL' ? classificationFilter : undefined,
  })

  // Asegurar que assets sea siempre un array
  const displayAssets = Array.isArray(assets) ? assets : []

  // Filter assets
  const filteredAssets = displayAssets.filter(asset => {
    const matchesSearch =
      !searchTerm ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'ALL' || asset.asset_type === typeFilter
    const matchesClassification =
      classificationFilter === 'ALL' ||
      asset.classification === classificationFilter

    return matchesSearch && matchesType && matchesClassification
  })

  const getAssetTypeIcon = (type: AssetType) => {
    switch (type) {
      case 'CRYPTO':
        return '₿'
      case 'ETF':
        return '📊'
      case 'STOCK':
        return '📈'
      case 'BOND':
        return '🏛️'
      case 'CASH':
        return '💵'
      default:
        return '💼'
    }
  }

  const getAssetTypeColor = (type: AssetType) => {
    switch (type) {
      case 'CRYPTO':
        return 'bg-accent/10 text-accent border-accent/20'
      case 'ETF':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'STOCK':
        return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'BOND':
        return 'bg-muted text-muted-foreground border-muted'
      case 'CASH':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      default:
        return 'bg-muted text-muted-foreground border-muted'
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#E4E8F0]">
              Activos
            </h1>
            <p className="text-[#A9B4C4]">
              Gestiona los instrumentos financieros de tu portfolio
            </p>
          </div>
          <Button
            asChild
            className="transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
          >
            <Link href="/assets/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Activo
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-[#15181E] bg-[#15181E]">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Coins className="h-4 w-4 text-[#A9B4C4]" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-[#A9B4C4]">
                    Total Activos
                  </p>
                  <p className="text-2xl font-bold text-[#E4E8F0]">
                    {filteredAssets.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#15181E] bg-[#15181E]">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-[#4ADE80]" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-[#A9B4C4]">
                    En Portfolio
                  </p>
                  <p className="text-2xl font-bold text-[#4ADE80]">
                    {Math.floor(filteredAssets.length * 0.7)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#15181E] bg-[#15181E]">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="grid grid-cols-3 gap-1">
                  {['CRYPTO', 'ETF', 'STOCK'].map(type => (
                    <div
                      key={type}
                      className="h-2 w-2 rounded-full bg-[#4ADE80] opacity-60"
                    />
                  ))}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-[#A9B4C4]">
                    Tipos Diferentes
                  </p>
                  <p className="text-2xl font-bold text-[#E4E8F0]">
                    {new Set(filteredAssets.map(a => a.asset_type)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#A9B4C4]" />
                  <Input
                    placeholder="Buscar activos por nombre o ticker..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="border-[#15181E] bg-[#0D0F12] pl-10 text-[#E4E8F0] placeholder:text-[#A9B4C4] focus:border-[#4ADE80] focus:ring-[#4ADE80]/20"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full sm:w-40">
                <Select
                  value={typeFilter}
                  onValueChange={value =>
                    setTypeFilter(value as AssetType | 'ALL')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los tipos</SelectItem>
                    <SelectItem value="CRYPTO">Crypto</SelectItem>
                    <SelectItem value="ETF">ETFs</SelectItem>
                    <SelectItem value="STOCK">Acciones</SelectItem>
                    <SelectItem value="BOND">Bonos</SelectItem>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="OTHER">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Classification Filter */}
              <div className="w-full sm:w-40">
                <Select
                  value={classificationFilter}
                  onValueChange={value =>
                    setClassificationFilter(
                      value as AssetClassification | 'ALL'
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Clasificaciones</SelectItem>
                    <SelectItem value="renta_fija">Renta Fija</SelectItem>
                    <SelectItem value="renta_variable">
                      Renta Variable
                    </SelectItem>
                    <SelectItem value="crypto">Criptomonedas</SelectItem>
                    <SelectItem value="alternative">Alternativos</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                    <div className="space-y-1">
                      <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-16 animate-pulse rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="bg-muted h-4 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredAssets.length > 0 ? (
            filteredAssets.map(asset => (
              <Card
                key={asset.id}
                className="group cursor-pointer border-[#15181E] bg-[#15181E] transition-all hover:border-[#4ADE80]/20 hover:bg-[#15181E]/80"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getAssetTypeIcon(asset.asset_type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#E4E8F0] transition-colors group-hover:text-[#4ADE80]">
                          {asset.ticker}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={cn(
                            'mt-1 text-xs',
                            getAssetTypeColor(asset.asset_type)
                          )}
                        >
                          {asset.asset_type}
                        </Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#A9B4C4] transition-colors group-hover:text-[#4ADE80]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="leading-tight font-medium text-[#E4E8F0]">
                      {asset.name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-[#A9B4C4]">
                      <span className="capitalize">
                        {asset.classification.replace('_', ' ')}
                      </span>
                      <span>{asset.currency}</span>
                    </div>
                    {asset.notes && (
                      <p className="line-clamp-2 text-xs text-[#A9B4C4]">
                        {asset.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="py-8 text-center">
                    <div className="mb-4 text-4xl">🔍</div>
                    <h3 className="mb-2 text-lg font-medium">
                      No se encontraron activos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ||
                      typeFilter !== 'ALL' ||
                      classificationFilter !== 'ALL'
                        ? 'Intenta ajustar los filtros de búsqueda'
                        : 'Comienza agregando tu primer activo al portfolio'}
                    </p>
                    <Button asChild>
                      <Link href="/assets/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Activo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Error Notice */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">
                ⚠️ Error conectando con el backend: {error.message}
                <br />
                <span className="text-xs">
                  Verifica que Spectra esté ejecutándose en localhost:8000
                </span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && displayAssets.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl">🏦</div>
                  <h3 className="mb-2 text-lg font-medium">No hay activos</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza agregando tu primer activo al portfolio
                  </p>
                  <Button asChild>
                    <Link href="/assets/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Activo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
