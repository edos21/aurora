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
import { Plus, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTransactions } from '@/hooks/useTransactions'
import { cn } from '@/lib/utils'
import type { AssetType, TransactionType } from '@/types'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL')
  const [assetTypeFilter, setAssetTypeFilter] = useState<AssetType | 'ALL'>(
    'ALL'
  )

  const { data: transactions, isLoading, error } = useTransactions()

  // Asegurar que transactions sea siempre un array
  const displayTransactions = Array.isArray(transactions) ? transactions : []

  // Filter transactions
  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesSearch =
      !searchTerm ||
      transaction.asset?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.asset?.ticker
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'ALL' || transaction.type === typeFilter
    const matchesAssetType =
      assetTypeFilter === 'ALL' ||
      transaction.asset?.asset_type === assetTypeFilter

    return matchesSearch && matchesType && matchesAssetType
  })

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#E4E8F0]">
              Transacciones
            </h1>
            <p className="text-[#A9B4C4]">
              Registro y seguimiento de todas tus operaciones
            </p>
          </div>
          <Button
            asChild
            className="transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
          >
            <Link href="/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Transacción
            </Link>
          </Button>
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
                    placeholder="Buscar por activo o ticker..."
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
                    setTypeFilter(value as TransactionType | 'ALL')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los tipos</SelectItem>
                    <SelectItem value="BUY">Compras</SelectItem>
                    <SelectItem value="SELL">Ventas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Type Filter */}
              <div className="w-full sm:w-40">
                <Select
                  value={assetTypeFilter}
                  onValueChange={value =>
                    setAssetTypeFilter(value as AssetType | 'ALL')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los activos</SelectItem>
                    <SelectItem value="CRYPTO">Crypto</SelectItem>
                    <SelectItem value="ETF">ETFs</SelectItem>
                    <SelectItem value="STOCK">Acciones</SelectItem>
                    <SelectItem value="BOND">Bonos</SelectItem>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-[#E4E8F0]">
              <span>Historial de Transacciones</span>
              <Badge
                variant="secondary"
                className="border-[#0D0F12] bg-[#0D0F12] text-[#A9B4C4]"
              >
                {filteredTransactions.length} transacciones
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 rounded-lg border border-[#0D0F12] bg-[#0D0F12]/30 p-4"
                  >
                    <div className="h-8 w-8 animate-pulse rounded-full bg-[#0D0F12]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/4 animate-pulse rounded bg-[#0D0F12]" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-[#0D0F12]" />
                    </div>
                    <div className="h-4 w-20 animate-pulse rounded bg-[#0D0F12]" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-[#0D0F12] bg-[#0D0F12]/30 p-4 transition-colors hover:bg-[#0D0F12]/50"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Transaction Type Icon */}
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full',
                          transaction.type === 'BUY'
                            ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                            : 'bg-[#F87171]/10 text-[#F87171]'
                        )}
                      >
                        {transaction.type === 'BUY' ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>

                      {/* Transaction Details */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-[#E4E8F0]">
                            {transaction.asset?.name || 'Asset desconocido'}
                          </p>
                          <Badge
                            variant="outline"
                            className="border-[#15181E] bg-[#0D0F12] text-xs text-[#A9B4C4]"
                          >
                            {transaction.asset?.ticker}
                          </Badge>
                          <Badge
                            variant={
                              transaction.type === 'BUY'
                                ? 'default'
                                : 'destructive'
                            }
                            className={cn(
                              'text-xs',
                              transaction.type === 'BUY'
                                ? 'border-[#4ADE80]/20 bg-[#4ADE80]/10 text-[#4ADE80]'
                                : 'border-[#F87171]/20 bg-[#F87171]/10 text-[#F87171]'
                            )}
                          >
                            {transaction.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-[#A9B4C4]">
                          <span>{transaction.quantity} unidades</span>
                          <span>
                            {format(new Date(transaction.date), 'dd MMM yyyy', {
                              locale: es,
                            })}
                          </span>
                          <span>
                            ${transaction.price_per_unit.toLocaleString()}/u
                          </span>
                          {transaction.commission > 0 && (
                            <span>Comisión: ${transaction.commission}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-lg font-semibold',
                          transaction.type === 'BUY'
                            ? 'text-[#F87171]'
                            : 'text-[#4ADE80]'
                        )}
                      >
                        {transaction.type === 'BUY' ? '-' : '+'}$
                        {transaction.total_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#A9B4C4]">
                        {transaction.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl">💳</div>
                <h3 className="mb-2 text-lg font-medium">
                  No hay transacciones
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ||
                  typeFilter !== 'ALL' ||
                  assetTypeFilter !== 'ALL'
                    ? 'No se encontraron transacciones con los filtros aplicados'
                    : 'Comienza registrando tu primera transacción'}
                </p>
                <Button asChild>
                  <Link href="/transactions/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Transacción
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
        {!isLoading && !error && displayTransactions.length === 0 && (
          <Card className="border-muted/20">
            <CardContent className="pt-6">
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl">📊</div>
                <h3 className="mb-2 text-lg font-medium">
                  No hay transacciones
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comienza registrando tu primera transacción
                </p>
                <Button asChild>
                  <Link href="/transactions/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Transacción
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
