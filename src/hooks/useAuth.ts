'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient, API_ENDPOINTS, APIError } from '@/lib/api'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  email: string
  account_id?: string
  created_at: string
  updated_at: string | null
}

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  user_id: string
  username: string
  email: string
  account_id: string
  token: {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
  }
}

interface AuthState {
  user: User | null
  token: string | null
  accountId: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    accountId: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const token = apiClient.getToken()

      if (!token) {
        setAuthState({
          user: null,
          token: null,
          accountId: null,
          isLoading: false,
          isAuthenticated: false,
        })
        return
      }

      // Try to get user info with current token
      try {
        const userData = await apiClient.get<User>(API_ENDPOINTS.USER_ME)

        setAuthState({
          user: userData,
          token,
          accountId: userData.account_id || null,
          isLoading: false,
          isAuthenticated: true,
        })
      } catch (error) {
        // Token is invalid or expired
        if (error instanceof APIError && error.status === 401) {
          // Clear invalid token
          apiClient.setToken(null)
          localStorage.removeItem('refresh_token')
        }

        setAuthState({
          user: null,
          token: null,
          accountId: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setAuthState({
        user: null,
        token: null,
        accountId: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }))

        const response = await apiClient.post<LoginResponse>(
          API_ENDPOINTS.AUTH_LOGIN,
          credentials
        )

        // Store tokens
        apiClient.setToken(response.token.access_token)
        localStorage.setItem('refresh_token', response.token.refresh_token)

        // Get user data
        const userData = await apiClient.get<User>(API_ENDPOINTS.USER_ME)

        setAuthState({
          user: userData,
          token: response.token.access_token,
          accountId: userData.account_id || response.account_id,
          isLoading: false,
          isAuthenticated: true,
        })

        // Redirect after successful login
        setTimeout(() => {
          toast.success('¡Inicio de sesión exitoso!')
          window.location.href = '/'
        }, 100)

        return true
      } catch (error) {
        console.error('Login failed:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    },
    []
  )

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if authenticated
      if (authState.isAuthenticated) {
        await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens and state
      apiClient.setToken(null)
      localStorage.removeItem('refresh_token')

      setAuthState({
        user: null,
        token: null,
        accountId: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [authState.isAuthenticated])

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  }
}
