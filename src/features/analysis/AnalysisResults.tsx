import { useState } from 'react'
import Box from '@mui/material/Box'
import { ProviderSummaryCard } from './ProviderSummaryCard'
import { LineItemTable } from './LineItemTable'
import { IssueCountBadge } from './IssueCountBadge'
import { IssueDetailPanel } from './IssueDetailPanel'
import { NegotiationLetter } from './NegotiationLetter'
import { NegotiationTipsList } from './NegotiationTipsList'
import { ParseWarningAlert } from '@/components/common/ParseWarningAlert'
import { PaywallModal } from '@/features/payment/PaywallModal'
import type { Analysis } from '@/types/analysis.types'

interface AnalysisResultsProps {
  analysis: Analysis
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const [paywallOpen, setPaywallOpen] = useState(false)
  const { free_data, paid_data, paid } = analysis

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <ParseWarningAlert warnings={free_data.parse_warnings} />
      <ProviderSummaryCard freeData={free_data} />

      {paid && paid_data ? (
        <IssueDetailPanel
          issues={paid_data.issues}
          totalSavings={paid_data.total_estimated_savings}
        />
      ) : (
        <IssueCountBadge
          count={free_data.issue_count}
          onUnlock={() => setPaywallOpen(true)}
        />
      )}

      <LineItemTable lineItems={free_data.line_items} />

      {paid && paid_data && (
        <>
          <NegotiationLetter letter={paid_data.negotiation_letter} />
          <NegotiationTipsList tips={paid_data.negotiation_tips} />
        </>
      )}

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        analysisId={analysis.id}
      />
    </Box>
  )
}
