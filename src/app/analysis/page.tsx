'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'

export default function AnalysisPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#E4E8F0]">
            Análisis de Portfolio
          </h1>
          <p className="text-[#A9B4C4]">
            Métricas avanzadas, correlaciones y sugerencias de rebalanceo
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-[#FBBF24]/20 bg-[#FBBF24]/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#FBBF24]">
              🚧 Próximamente - Sprint 5
              <Badge
                variant="outline"
                className="ml-auto border-[#15181E] bg-[#0D0F12] text-[#A9B4C4]"
              >
                En desarrollo
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-[#A9B4C4]">
              Esta sección estará disponible en el Sprint 5 del roadmap de
              desarrollo. Incluirá análisis avanzado de portfolio y métricas de
              riesgo.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="border-dashed border-[#15181E] bg-[#15181E]">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <PieChart className="h-8 w-8 text-[#A9B4C4]" />
                    <div>
                      <h3 className="font-medium text-[#E4E8F0]">
                        Allocation Analysis
                      </h3>
                      <p className="text-sm text-[#A9B4C4]">
                        Análisis detallado de distribución por tipo y
                        clasificación
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="text-muted-foreground h-8 w-8" />
                    <div>
                      <h3 className="font-medium">Risk Metrics</h3>
                      <p className="text-muted-foreground text-sm">
                        Volatilidad, Sharpe ratio, máximo drawdown
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="text-muted-foreground h-8 w-8" />
                    <div>
                      <h3 className="font-medium">Performance Tracking</h3>
                      <p className="text-muted-foreground text-sm">
                        Seguimiento de rendimiento histórico y comparativas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3">
                    <Activity className="text-muted-foreground h-8 w-8" />
                    <div>
                      <h3 className="font-medium">Rebalance Suggestions</h3>
                      <p className="text-muted-foreground text-sm">
                        Sugerencias inteligentes de rebalanceo automático
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 border-t pt-4">
              <p className="text-muted-foreground text-xs">
                📈 Implementación planificada: Semana 6-7 del roadmap de
                desarrollo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Sprint Status */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="text-[#E4E8F0]">
              Estado Actual del Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sprint 1: Core CRUD & UI</span>
                <Badge variant="default">✅ Completado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sprint 2: Prices Sync & Charts</span>
                <Badge variant="outline">⏳ Pendiente</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sprint 3: Technical Indicators</span>
                <Badge variant="outline">⏳ Pendiente</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sprint 4: News & Alerts</span>
                <Badge variant="outline">⏳ Pendiente</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Sprint 5: Portfolio Analysis
                </span>
                <Badge variant="secondary">🎯 Esta página</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
