'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface PublicRouteProps {
  children: React.ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

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

  if (isAuthenticated) {
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
