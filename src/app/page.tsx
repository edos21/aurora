'use client'

import AppLayout from '@/components/layout/AppLayout'
import PortfolioSummaryCard from '@/components/dashboard/PortfolioSummaryCard'
import AllocationPieChart from '@/components/dashboard/AllocationPieChart'
import RecentTransactionsTable from '@/components/dashboard/RecentTransactionsTable'
import {
  usePortfolioSummary,
  usePortfolioAllocation,
} from '@/hooks/usePortfolio'
import { useRecentTransactions } from '@/hooks/useTransactions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const {
    data: portfolioSummary,
    isLoading: summaryLoading,
    error: summaryError,
  } = usePortfolioSummary()
  const { data: allocationByType, isLoading: allocationLoading } =
    usePortfolioAllocation('type')
  const { data: allocationByClassification } =
    usePortfolioAllocation('classification')
  const { data: recentTransactions, isLoading: transactionsLoading } =
    useRecentTransactions(5)

  // Usar datos reales del backend o valores por defecto
  const displaySummary = portfolioSummary || {
    total_value_usd: 0,
    total_invested_usd: 0,
    total_pnl_usd: 0,
    total_pnl_pct: 0,
    holdings_count: 0,
    transactions_count: 0,
  }

  const displayAllocation = Array.isArray(allocationByType)
    ? allocationByType
    : []
  const displayTransactions = Array.isArray(recentTransactions)
    ? recentTransactions
    : []

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de tu portfolio de inversiones
          </p>
        </div>

        {/* Error State */}
        {summaryError && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No se pudo conectar con el backend. Mostrando datos de ejemplo.
              <br />
              <span className="text-muted-foreground text-xs">
                Verifica que Spectra esté ejecutándose en localhost:8000
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="border-[#15181E] bg-[#15181E]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20 animate-pulse rounded bg-[#0D0F12]" />
                  <Skeleton className="h-4 w-4 animate-pulse rounded bg-[#0D0F12]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-24 animate-pulse rounded bg-[#0D0F12]" />
                  <Skeleton className="h-3 w-16 animate-pulse rounded bg-[#0D0F12]" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <PortfolioSummaryCard
                title="Valor Total"
                value={`$${displaySummary.total_value_usd?.toLocaleString() || '0'}`}
                change={{
                  value: `${typeof displaySummary.total_pnl_pct === 'number' ? displaySummary.total_pnl_pct.toFixed(1) : '0'}%`,
                  isPositive: (displaySummary.total_pnl_usd || 0) >= 0,
                  period: 'total',
                }}
                icon="dollar"
              />
              <PortfolioSummaryCard
                title="P&L Total"
                value={`$${displaySummary.total_pnl_usd?.toLocaleString() || '0'}`}
                change={{
                  value: `${typeof displaySummary.total_pnl_pct === 'number' ? displaySummary.total_pnl_pct.toFixed(1) : '0'}%`,
                  isPositive: (displaySummary.total_pnl_usd || 0) >= 0,
                  period: 'ganancia',
                }}
                icon={
                  (displaySummary.total_pnl_usd || 0) >= 0
                    ? 'trend-up'
                    : 'trend-down'
                }
              />
              <PortfolioSummaryCard
                title="Inversión Total"
                value={`$${displaySummary.total_invested_usd?.toLocaleString() || '0'}`}
                icon="activity"
              />
              <PortfolioSummaryCard
                title="Activos"
                value={`${displaySummary.holdings_count || 0}`}
                change={{
                  value: `${displaySummary.transactions_count || 0}`,
                  isPositive: true,
                  period: 'transacciones',
                }}
                icon="activity"
              />
            </>
          )}
        </div>

        {/* Charts and Tables */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Allocation Chart */}
          <div className="lg:col-span-1">
            <AllocationPieChart
              data={displayAllocation}
              title="Allocation por Tipo"
            />
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <RecentTransactionsTable
              transactions={displayTransactions}
              isLoading={transactionsLoading}
            />
          </div>
        </div>

        {/* Connection Status */}
        {summaryError && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                ⚠️ Error de Conexión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2 text-sm">
                No se pudo conectar con el backend Spectra:{' '}
                {summaryError.message}
              </p>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>
                  • Verifica que Spectra esté ejecutándose en localhost:8000
                </li>
                <li>
                  • Revisa el estado del sistema en{' '}
                  <a href="/health" className="text-primary hover:underline">
                    /health
                  </a>
                </li>
                <li>• Asegúrate de que la base de datos esté configurada</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Empty Portfolio */}
        {!summaryError &&
          !summaryLoading &&
          displaySummary.holdings_count === 0 && (
            <Card className="border-muted/20">
              <CardContent className="pt-6">
                <div className="py-8 text-center">
                  <div className="mb-4 text-4xl">🏦</div>
                  <h3 className="mb-2 text-lg font-medium">Portfolio Vacío</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza agregando tus primeras transacciones para ver el
                    dashboard
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
