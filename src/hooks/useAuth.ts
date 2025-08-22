'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar token en localStorage
        const token = localStorage.getItem('auth_token')

        if (!token) {
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          })
          return
        }

        // Si el token es 'authenticated', intentar obtener datos reales del backend
        if (token === 'authenticated') {
          try {
            const response = await fetch(
              'http://localhost:8000/api/v1/users/me',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )

            if (response.ok) {
              const userData = await response.json()
              if (process.env.NODE_ENV === 'development') {
                console.log('✅ Datos reales del backend obtenidos:', userData)
              }

              setAuthState({
                user: userData,
                token,
                isLoading: false,
                isAuthenticated: true,
              })
              return
            } else {
              // Token inválido o backend respondió con error
              localStorage.removeItem('auth_token')
              document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'

              setAuthState({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
              })
              return
            }
          } catch (apiError) {
            // Backend no disponible, limpiar autenticación
            localStorage.removeItem('auth_token')
            document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'

            setAuthState({
              user: null,
              token: null,
              isLoading: false,
              isAuthenticated: false,
            })
            return
          }
        }

        // Si hay token real, intentar obtener información del usuario desde API
        try {
          const response = await fetch(
            'http://localhost:8000/api/v1/users/me',
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )

          if (response.ok) {
            const userData = await response.json()

            setAuthState({
              user: userData,
              token,
              isLoading: false,
              isAuthenticated: true,
            })
          } else {
            // Token inválido, limpiar autenticación
            localStorage.removeItem('auth_token')
            document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'

            setAuthState({
              user: null,
              token: null,
              isLoading: false,
              isAuthenticated: false,
            })
          }
        } catch (apiError) {
          // Backend no disponible, limpiar autenticación
          localStorage.removeItem('auth_token')
          document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'

          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          })
        }
      } catch (error) {
        console.error('💥 Error en checkAuth:', error)
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkAuth()
  }, [])

  return authState
}
