const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add Authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      headers,
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        // Handle 401 Unauthorized (token expired)
        if (response.status === 401 && this.token) {
          // Try to refresh token
          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const refreshResponse = await fetch(
                `${this.baseURL}${API_ENDPOINTS.AUTH_REFRESH}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refresh_token: refreshToken }),
                }
              )

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json()
                this.setToken(refreshData.access_token)
                localStorage.setItem('refresh_token', refreshData.refresh_token)

                // Retry the original request with new token
                const retryConfig = {
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: `Bearer ${refreshData.access_token}`,
                  },
                }
                const retryResponse = await fetch(url, retryConfig)

                if (retryResponse.ok) {
                  if (retryResponse.status === 204) {
                    return {} as T
                  }
                  return await retryResponse.json()
                }
              }
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            this.setToken(null)
            localStorage.removeItem('refresh_token')
          }
        }

        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { message: 'Unknown error occurred' }
        }

        throw new APIError(
          response.status,
          errorData.message || `HTTP ${response.status}`,
          errorData
        )
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }

      // Network or other errors
      throw new APIError(0, 'Network error or server unavailable')
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }

    return this.request<T>(url, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new APIClient()
export { APIError }

// API endpoints constants
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Authentication
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_VERIFY: '/api/v1/auth/verify',

  // Portfolio
  PORTFOLIO_SUMMARY: '/api/v1/portfolio/summary',
  PORTFOLIO_HOLDINGS: '/api/v1/portfolio/holdings',
  PORTFOLIO_HOLDING_BY_ASSET: (assetId: string) =>
    `/api/v1/portfolio/holdings/${assetId}`,

  // Assets
  ASSETS: '/api/v1/assets/',
  ASSET_BY_ID: (id: string) => `/api/v1/assets/${id}`,

  // Transactions
  TRANSACTIONS: '/api/v1/transactions/',
  TRANSACTION_BY_ID: (id: string) => `/api/v1/transactions/${id}`,

  // Prices
  SYNC_PRICES: '/api/v1/assets/sync/prices',
  ASSET_PRICES: (assetId: string) => `/api/v1/assets/${assetId}/prices/history`,
  LATEST_PRICES: (assetId: string) => `/api/v1/assets/${assetId}/prices/latest`,

  // Users
  USERS: '/api/v1/users/',
  USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
  USER_ME: '/api/v1/users/me',
} as const
