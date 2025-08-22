'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { TransactionResponse } from '@/types'
import { cn } from '@/lib/utils'

interface RecentTransactionsTableProps {
  transactions: TransactionResponse[]
  isLoading?: boolean
  className?: string
}

export default function RecentTransactionsTable({
  transactions,
  isLoading,
  className,
}: RecentTransactionsTableProps) {
  if (isLoading) {
    return (
      <Card className={cn('border-[#15181E] bg-[#15181E]', className)}>
        <CardHeader>
          <CardTitle className="text-[#E4E8F0]">
            Transacciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-4 animate-pulse rounded bg-[#0D0F12]" />
                <div className="h-4 flex-1 animate-pulse rounded bg-[#0D0F12]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[#0D0F12]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-[#15181E] bg-[#15181E]', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#E4E8F0]">
          Transacciones Recientes
        </CardTitle>
        <Button
          asChild
          size="sm"
          className="transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
        >
          <Link href="/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 5).map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-[#0D0F12] bg-[#0D0F12]/50 p-3 transition-colors hover:bg-[#0D0F12]/70"
              >
                <div className="flex items-center space-x-3">
                  {/* Transaction Type Icon */}
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      transaction.type === 'BUY'
                        ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                        : 'bg-[#F87171]/10 text-[#F87171]'
                    )}
                  >
                    {transaction.type === 'BUY' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-[#E4E8F0]">
                        {transaction.asset?.name ||
                          transaction.asset?.ticker ||
                          'Asset desconocido'}
                      </p>
                      <Badge
                        variant={
                          transaction.type === 'BUY' ? 'default' : 'destructive'
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
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={cn(
                      'font-medium',
                      transaction.type === 'BUY'
                        ? 'text-[#F87171]'
                        : 'text-[#4ADE80]'
                    )}
                  >
                    {transaction.type === 'BUY' ? '-' : '+'}$
                    {transaction.total_amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#A9B4C4]">
                    ${transaction.price_per_unit.toLocaleString()}/u
                  </p>
                </div>
              </div>
            ))}

            {/* View All Link */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#15181E] bg-[#0D0F12] text-[#A9B4C4] transition-all duration-200 hover:border-[#4ADE80]/20 hover:bg-[#15181E] hover:text-[#E4E8F0]"
                asChild
              >
                <Link href="/transactions">Ver todas las transacciones</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-2 text-4xl">💳</div>
            <p className="mb-4 text-[#A9B4C4]">
              No hay transacciones registradas
            </p>
            <Button
              asChild
              className="transform bg-gradient-to-r from-[#38BDF8] to-[#4ADE80] font-semibold text-[#0D0F12] transition-all duration-200 hover:scale-[1.02] hover:from-[#0EA5E9] hover:to-[#22C55E]"
            >
              <Link href="/transactions/new">
                <Plus className="mr-2 h-4 w-4" />
                Registrar primera transacción
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
