export { AssetDiscovery } from './AssetDiscovery'
export { AssetSearch } from './AssetSearch'
export { AssetConfirmation } from './AssetConfirmation'

// Types
export interface AssetSearchResult {
  id?: string
  ticker: string
  name: string
  asset_type: string
  classification: string
  currency: string
  source: string
  external_id?: string
  is_popular: boolean
  popularity_rank?: number
  current_price_usd?: number
  price_change_24h?: number
  volume_24h?: number
  market_cap?: number
}

export interface CustomAssetData {
  ticker: string
  name: string
  asset_type: string
  classification: string
  currency: string
  notes?: string
}
