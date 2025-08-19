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

export default function Home() {
  const router = useRouter()
  const [spectraStatus, setSpectraStatus] = useState<SpectraStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Verificación inmediata de autenticación antes del render
  const hasToken = () => {
    if (typeof window === 'undefined') return false

    const localToken = localStorage.getItem('auth_token')
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    return !!(localToken || cookieToken)
  }

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    // Eliminar cookie también
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && hasToken()) {
      setIsAuthenticated(true)
      setIsCheckingAuth(false)
      checkSpectraConnection()
    } else if (mounted) {
      setIsCheckingAuth(false)
    }
  }, [mounted])

  // Verificación inmediata - Si no hay token, redirigir antes de mostrar cualquier cosa
  if (typeof window !== 'undefined' && !hasToken() && mounted) {
    window.location.href = '/login'
    return null
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isCheckingAuth || !mounted) {
    return (
      <div className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-8">
        <div className="space-y-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-400"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="relative space-y-4 text-center">
          {isAuthenticated && (
            <div className="absolute top-0 right-0">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-muted-foreground/20 text-muted-foreground hover:bg-muted/10 bg-transparent"
              >
                Cerrar Sesión
              </Button>
            </div>
          )}
          <div className="inline-block">
            <h1 className="bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-6xl font-bold text-transparent">
              ✨ Lumina
            </h1>
            <p className="text-muted-foreground mt-2 text-xl">
              Dando luz a tus finanzas
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
              {!mounted ? (
                <div className="text-muted-foreground text-sm">
                  🔄 Cargando...
                </div>
              ) : spectraStatus ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">
                      Estado:
                    </span>
                    <span className="text-sm font-medium text-green-400">
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
                <div className="text-sm text-red-400">❌ Error: {error}</div>
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

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Siguientes Pasos (Sprint 1)</CardTitle>
            <CardDescription>
              Funcionalidades a implementar en la siguiente fase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">▪</span>
                <span>Implementar CRUD de activos y transacciones</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">▪</span>
                <span>Configurar base de datos PostgreSQL</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">▪</span>
                <span>Crear dashboard principal con métricas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">▪</span>
                <span>Desarrollar formularios de captura de datos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
