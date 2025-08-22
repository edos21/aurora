'use client'

import AppLayout from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Settings, Key, Database, RotateCw, Bell } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#E4E8F0]">
            Configuración
          </h1>
          <p className="text-[#A9B4C4]">
            Administra APIs, sincronización y preferencias del sistema
          </p>
        </div>

        {/* API Keys Section */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <Key className="h-5 w-5 text-[#A9B4C4]" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {/* CoinGecko */}
              <div className="space-y-2">
                <Label htmlFor="coingecko-key" className="text-[#E4E8F0]">
                  CoinGecko API Key (Opcional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="coingecko-key"
                    placeholder="Ingresa tu CoinGecko API key..."
                    type="password"
                    disabled
                    className="border-[#15181E] bg-[#0D0F12] text-[#E4E8F0] placeholder:text-[#A9B4C4]"
                  />
                  <Button
                    variant="outline"
                    disabled
                    className="border-[#15181E] bg-[#0D0F12] text-[#A9B4C4]"
                  >
                    Guardar
                  </Button>
                </div>
                <p className="text-xs text-[#A9B4C4]">
                  Para datos de criptomonedas. API gratuita disponible sin key.
                </p>
              </div>

              {/* AlphaVantage */}
              <div className="space-y-2">
                <Label htmlFor="alphavantage-key">
                  AlphaVantage API Key (Opcional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="alphavantage-key"
                    placeholder="Ingresa tu AlphaVantage API key..."
                    type="password"
                    disabled
                  />
                  <Button variant="outline" disabled>
                    Guardar
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Para datos de stocks y ETFs. Límite: 5 calls/min gratuito.
                </p>
              </div>

              {/* Finnhub */}
              <div className="space-y-2">
                <Label htmlFor="finnhub-key">Finnhub API Key (Opcional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="finnhub-key"
                    placeholder="Ingresa tu Finnhub API key..."
                    type="password"
                    disabled
                  />
                  <Button variant="outline" disabled>
                    Guardar
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Para noticias financieras. 60 calls/min gratuito.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Badge
                variant="outline"
                className="bg-warning/5 text-warning border-warning/20"
              >
                🚧 Configuración pendiente para Sprint 2
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <RotateCw className="h-5 w-5 text-[#A9B4C4]" />
              Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Sincronización Automática</Label>
                <p className="text-muted-foreground text-sm">
                  Actualizar precios automáticamente cada 15 minutos
                </p>
              </div>
              <Switch id="auto-sync" disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-weekend">
                  Sincronizar Fines de Semana
                </Label>
                <p className="text-muted-foreground text-sm">
                  Incluir crypto en sincronización 24/7
                </p>
              </div>
              <Switch id="sync-weekend" disabled />
            </div>

            <div className="border-t pt-4">
              <Badge
                variant="outline"
                className="bg-warning/5 text-warning border-warning/20"
              >
                🚧 Funcionalidad pendiente para Sprint 2
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <Bell className="h-5 w-5 text-[#A9B4C4]" />
              Notificaciones y Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price-alerts">Alertas de Precio</Label>
                <p className="text-muted-foreground text-sm">
                  Notificar cambios de precio mayor al 5% en 24h
                </p>
              </div>
              <Switch id="price-alerts" disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="news-alerts">Alertas de Noticias</Label>
                <p className="text-muted-foreground text-sm">
                  Notificaciones de noticias relevantes de activos
                </p>
              </div>
              <Switch id="news-alerts" disabled />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rebalance-alerts">
                  Sugerencias de Rebalanceo
                </Label>
                <p className="text-muted-foreground text-sm">
                  Avisar cuando el portfolio necesite rebalancearse
                </p>
              </div>
              <Switch id="rebalance-alerts" disabled />
            </div>

            <div className="border-t pt-4">
              <Badge
                variant="outline"
                className="bg-warning/5 text-warning border-warning/20"
              >
                🚧 Sistema de alertas pendiente para Sprint 4
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="border-[#15181E] bg-[#15181E]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E4E8F0]">
              <Database className="h-5 w-5 text-[#A9B4C4]" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Frontend (Aurora)</Label>
                <p className="text-muted-foreground text-sm">
                  v0.1.0 - Sprint 1
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Backend (Spectra)</Label>
                <p className="text-muted-foreground text-sm">
                  Conectividad pendiente
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Base de Datos</Label>
                <p className="text-muted-foreground text-sm">
                  PostgreSQL (pendiente)
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Estado del Sistema
                </Label>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/health">Ver Detalles</Link>
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup y Export</Label>
                  <p className="text-muted-foreground text-sm">
                    Exportar datos del portfolio
                  </p>
                </div>
                <Button variant="outline" disabled>
                  Exportar JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Status */}
        <Card className="border-[#4ADE80]/20 bg-[#4ADE80]/5">
          <CardHeader>
            <CardTitle className="text-[#4ADE80]">
              🚀 Estado del Desarrollo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Esta página de configuración se implementará gradualmente conforme
              avance el desarrollo.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sprint 2: Configuración de APIs</span>
                <Badge variant="outline">Pendiente</Badge>
              </div>
              <div className="flex justify-between">
                <span>Sprint 3: Configuración de Sync</span>
                <Badge variant="outline">Pendiente</Badge>
              </div>
              <div className="flex justify-between">
                <span>Sprint 4: Sistema de Alertas</span>
                <Badge variant="outline">Pendiente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
