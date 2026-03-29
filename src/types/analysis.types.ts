export interface LineItem {
  description: string
  cpt_code: string | null
  billed_amount: number | null
  adjusted_amount: number | null
  patient_responsibility: number | null
  plain_english: string
}

export type Confidence = 'high' | 'medium' | 'low'

export interface FreeData {
  provider_name: string
  bill_date: string | null
  total_billed: number | null
  total_due: number | null
  currency: string
  line_items: LineItem[]
  issue_count: number
  confidence: Confidence
  parse_warnings: string[]
}

export type IssueType =
  | 'duplicate'
  | 'upcoding'
  | 'unbundling'
  | 'incorrect_modifier'
  | 'balance_billing'
  | 'itemization_error'
  | 'other'

export type Severity = 'high' | 'medium' | 'low'

export interface Issue {
  id: string
  type: IssueType
  severity: Severity
  line_item_ref: string | null
  description: string
  estimated_savings: number | null
  action: string
}

export interface NegotiationLetter {
  subject: string
  body: string
  placeholders: string[]
}

export interface PaidData {
  issues: Issue[]
  total_estimated_savings: number | null
  negotiation_letter: NegotiationLetter
  negotiation_tips: string[]
}

export type AnalysisStatus = 'processing' | 'complete' | 'failed'

export interface Analysis {
  id: string
  status: AnalysisStatus
  paid: boolean
  free_data: FreeData
  paid_data: PaidData | null
  created_at: string
  expires_at: string
}
