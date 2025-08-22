'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PortfolioSummaryCardProps {
  title: string
  value: string
  change?: {
    value: string
    isPositive: boolean
    period: string
  }
  icon: 'dollar' | 'trend-up' | 'trend-down' | 'activity'
  className?: string
}

const iconMap = {
  dollar: DollarSign,
  'trend-up': TrendingUp,
  'trend-down': TrendingDown,
  activity: Activity,
}

export default function PortfolioSummaryCard({
  title,
  value,
  change,
  icon,
  className,
}: PortfolioSummaryCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card
      className={cn(
        'bg-card border-border hover:bg-card/80 transition-colors',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-foreground text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 text-xs">
            {change.isPositive ? (
              <TrendingUp className="text-primary h-3 w-3" />
            ) : (
              <TrendingDown className="text-destructive h-3 w-3" />
            )}
            <span
              className={cn(
                'font-medium',
                change.isPositive ? 'text-primary' : 'text-destructive'
              )}
            >
              {change.value}
            </span>
            <span className="text-muted-foreground">{change.period}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
