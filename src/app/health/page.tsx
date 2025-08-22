'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SpectraStatus {
  status: string
  service: string
  version: string
  timestamp: string
}

export default function HealthPage() {
  const router = useRouter()
  const [spectraStatus, setSpectraStatus] = useState<SpectraStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const checkSpectraConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/health')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setSpectraStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSpectraStatus(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    checkSpectraConnection()
  }, [])

  if (!mounted) {
    return (
      <div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-8">
        <div className="space-y-4 text-center">
          <div className="border-primary inline-block h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">
            Cargando estado del sistema...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="relative space-y-4 text-center">
          <div className="absolute top-0 left-0">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-muted-foreground/20 text-muted-foreground hover:bg-muted/10 bg-transparent"
            >
              ← Volver al Dashboard
            </Button>
          </div>
          <div className="inline-block">
            <h1 className="from-secondary via-primary to-accent bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
              ⚕️ Sistema
            </h1>
            <p className="text-muted-foreground mt-2 text-xl">
              Estado y diagnóstico de Lumina
            </p>
          </div>
        </div>

        {/* Stack Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Aurora Frontend
              </CardTitle>
              <CardDescription>
                Interfaz de usuario desarrollada con Next.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Framework:
                </span>
                <span className="text-sm font-medium">
                  Next.js + TypeScript
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">UI:</span>
                <span className="text-sm font-medium">
                  shadcn/ui + TailwindCSS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Tema:</span>
                <span className="text-sm font-medium">Dark Mode 🌙</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Puerto:</span>
                <span className="text-sm font-medium">3000</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ Spectra Backend
              </CardTitle>
              <CardDescription>API de análisis financiero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {spectraStatus ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Estado:
                    </span>
                    <span className="text-primary text-sm font-medium">
                      {spectraStatus.status === 'healthy'
                        ? '✅ Conectado'
                        : '❌ Error'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Servicio:
                    </span>
                    <span className="text-sm font-medium">
                      {spectraStatus.service}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Versión:
                    </span>
                    <span className="text-sm font-medium">
                      {spectraStatus.version}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Puerto:
                    </span>
                    <span className="text-sm font-medium">8000</span>
                  </div>
                </>
              ) : error ? (
                <div className="text-destructive text-sm">
                  ❌ Error: {error}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  🔄 Verificando conexión...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={checkSpectraConnection}
            disabled={loading}
            variant="default"
          >
            {loading ? '🔄 Verificando...' : '🔄 Verificar Conexión'}
          </Button>

          <Button variant="outline" asChild>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 API Docs
            </a>
          </Button>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Detalles del Sistema</CardTitle>
            <CardDescription>
              Información detallada del estado de los servicios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Estado Frontend:
                  </span>
                  <div className="text-primary font-medium">✅ Operativo</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado Backend:</span>
                  <div
                    className={`font-medium ${spectraStatus ? 'text-primary' : 'text-destructive'}`}
                  >
                    {spectraStatus ? '✅ Conectado' : '❌ Desconectado'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Base de Datos:</span>
                  <div className="text-warning font-medium">
                    ⚠️ No implementado
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">APIs Externas:</span>
                  <div className="text-warning font-medium">
                    ⚠️ No implementado
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Info */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Estado del Desarrollo (Sprint 1)</CardTitle>
            <CardDescription>
              Progreso de implementación de funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✅</span>
                <span>React Query y estado de la aplicación configurado</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✅</span>
                <span>Paleta de colores Aurora implementada</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-warning">🔄</span>
                <span>Layout principal con navegación (en progreso)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">⏳</span>
                <span>Dashboard con métricas de portfolio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">⏳</span>
                <span>Formularios de transacciones</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">⏳</span>
                <span>Gestión de activos con búsqueda</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
