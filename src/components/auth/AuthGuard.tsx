'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  const protectedRoutes = [
    '/',
    '/dashboard',
    '/assets',
    '/transactions',
    '/analysis',
    '/settings',
    '/health',
  ]
  const publicRoutes = ['/login', '/register']

  useEffect(() => {
    // Esperar a que termine la carga
    if (isLoading) {
      return
    }

    // Si está en una ruta protegida sin autenticación, redirigir a login
    if (protectedRoutes.includes(pathname) && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Si está en una ruta pública con autenticación, redirigir al dashboard
    if (publicRoutes.includes(pathname) && isAuthenticated) {
      router.push('/')
      return
    }
  }, [pathname, isAuthenticated, isLoading, router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Prevenir flash del contenido en rutas protegidas sin auth
  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Redirigiendo a login...</p>
        </div>
      </div>
    )
  }

  // Prevenir flash del contenido en rutas públicas con auth
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
