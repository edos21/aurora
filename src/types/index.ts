// Asset Types
export type AssetType = 'ETF' | 'STOCK' | 'CRYPTO' | 'BOND' | 'CASH' | 'OTHER'
export type AssetClassification =
  | 'renta_fija'
  | 'renta_variable'
  | 'crypto'
  | 'alternative'
  | 'cash'

export interface Asset {
  id: string
  ticker: string
  name: string
  asset_type: AssetType
  classification: AssetClassification
  currency: string
  notes?: string
  extra_data?: Record<string, any>
  created_at: string
  updated_at?: string
}

export interface AssetResponse extends Asset {}

export interface AssetCreate {
  ticker: string
  name: string
  asset_type: AssetType
  classification: AssetClassification
  currency: string
  notes?: string
  extra_data?: Record<string, any>
  account_id?: string
}

// Transaction Types
export type TransactionType = 'BUY' | 'SELL'

export interface Transaction {
  id: string
  asset_id: string
  date: string
  type: TransactionType
  quantity: number
  price_per_unit: number
  total_amount: number
  currency: string
  commission: number
  notes?: string
  created_at: string
  updated_at?: string
}

export interface TransactionResponse extends Transaction {
  asset?: AssetResponse
}

export interface TransactionCreate {
  asset_id: string
  date: string
  type: TransactionType
  quantity: number
  price_per_unit: number
  total_amount: number
  currency: string
  commission?: number
  notes?: string
}

// Portfolio Types
export interface HoldingResponse {
  asset: AssetResponse
  total_quantity: number
  avg_price_usd: number
  current_price_usd: number
  current_value_usd: number
  invested_amount_usd: number
  unrealized_pnl_usd: number
  unrealized_pnl_pct: number
  allocation_pct: number
}

export interface AllocationByType {
  asset_type: string
  value_usd: number
  allocation_pct: number
  count: number
}

export interface AllocationByClassification {
  classification: string
  value_usd: number
  allocation_pct: number
  count: number
}

export interface PortfolioSummary {
  total_value_usd: number
  total_invested_usd: number
  total_pnl_usd: number
  total_pnl_pct: number
  holdings_count: number
  transactions_count: number
  allocation_by_type: AllocationByType[]
  allocation_by_classification: AllocationByClassification[]
  last_updated?: string
}

export interface PortfolioHoldings {
  holdings: HoldingResponse[]
  summary: PortfolioSummary
}

// Price Types
export interface PriceData {
  id: string
  asset_id: string
  date: string
  price_usd: number
  source: string
  raw_data?: Record<string, any>
  created_at: string
}

export interface LatestPrice {
  asset_id: string
  price_usd: number
  date: string
  source: string
}

export interface PriceSeries {
  asset_id: string
  data: PriceData[]
}

// User Types
export interface User {
  id: string
  username: string
  email: string
  created_at: string
  updated_at?: string
}

export interface UserResponse extends User {}

export interface UserCreate {
  username: string
  email: string
}

// Health Types
export interface HealthCheck {
  status: string
  service: string
  timestamp: string
  version: string
  environment: string
  database: string
  database_url_type: string
}

export interface DetailedHealthCheck {
  status: string
  timestamp: string
  checks: Record<string, { status: string; error?: string }>
  version: string
}

// Search and Filter Types
export interface PortfolioSearch {
  asset_type?: AssetType
  classification?: AssetClassification
  min_allocation_pct?: number
  only_active?: boolean
}

export interface AssetSearch {
  search?: string
  asset_type?: AssetType
  classification?: AssetClassification
  limit?: number
}

export interface TransactionSearch {
  asset_id?: string
  from?: string
  to?: string
  type?: TransactionType
  limit?: number
}

// API Response Types
export interface APIResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

// Chart Data Types
export interface ChartDataPoint {
  date: string
  value: number
  [key: string]: any
}

export interface AllocationChartData {
  name: string
  value: number
  percentage: number
  color?: string
}

// Form Types
export interface SearchFormData {
  query: string
  asset_type?: AssetType
  classification?: AssetClassification
}

// UI State Types
export interface UIState {
  isLoading: boolean
  error?: string | null
  success?: string | null
}

export interface TableState {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page: number
  pageSize: number
}
