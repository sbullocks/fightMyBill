export type ProductType = 'single' | 'pack'

export type PaymentStatus = 'pending' | 'complete' | 'failed'

export interface CheckoutRequest {
  analysis_id: string
  product_type: ProductType
  session_id: string
  success_url: string
  cancel_url: string
}

export interface CheckoutResponse {
  checkout_url: string
}

export interface BillPack {
  id: string
  user_id: string
  total_credits: number
  used_credits: number
  active: boolean
  created_at: string
  expires_at: string
}
