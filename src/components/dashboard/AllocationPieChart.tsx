'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { AllocationByType, AllocationByClassification } from '@/types'

interface AllocationPieChartProps {
  data: AllocationByType[] | AllocationByClassification[]
  title: string
  className?: string
}

// Lumina color palette for charts
const COLORS = [
  '#4ADE80', // Primary green
  '#38BDF8', // Ice blue
  '#A78BFA', // Purple
  '#FBBF24', // Gold
  '#F87171', // Coral red
  '#34D399', // Emerald
  '#FB7185', // Rose
  '#8B5CF6', // Violet
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="border-border bg-popover rounded-lg border p-3 shadow-2xl backdrop-blur-sm">
        <p className="text-popover-foreground font-medium">{data.name}</p>
        <p className="text-muted-foreground text-sm">
          ${data.value_usd?.toLocaleString() || 0}
        </p>
        <p className="text-primary text-sm">
          {data.allocation_pct?.toFixed(1)}% del portfolio
        </p>
        <p className="text-muted-foreground text-xs">
          {data.count} activo{data.count > 1 ? 's' : ''}
        </p>
      </div>
    )
  }
  return null
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.05) return null // Don't show labels for slices < 5%

  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function AllocationPieChart({
  data,
  title,
  className,
}: AllocationPieChartProps) {
  // Transform data for recharts
  const chartData = data.map((item, index) => ({
    name: 'asset_type' in item ? item.asset_type : item.classification,
    value: item.value_usd,
    value_usd: item.value_usd,
    allocation_pct: item.allocation_pct,
    count: item.count,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader>
        <CardTitle className="text-card-foreground text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span
                      className="text-foreground text-sm"
                      style={{ color: entry.color }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 text-4xl">📊</div>
              <p className="text-muted-foreground">
                No hay datos de allocation
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Agrega transacciones para ver la distribución de tu portfolio
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
