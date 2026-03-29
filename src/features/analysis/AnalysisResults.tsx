import Box from '@mui/material/Box'
import { ProviderSummaryCard } from './ProviderSummaryCard'
import { LineItemTable } from './LineItemTable'
import { IssueCountBadge } from './IssueCountBadge'
import { ParseWarningAlert } from '@/components/common/ParseWarningAlert'
import type { Analysis } from '@/types/analysis.types'

interface AnalysisResultsProps {
  analysis: Analysis
  onUnlock?: () => void
}

export function AnalysisResults({ analysis, onUnlock }: AnalysisResultsProps) {
  const { free_data } = analysis

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
      <ParseWarningAlert warnings={free_data.parse_warnings} />
      <ProviderSummaryCard freeData={free_data} />
      <IssueCountBadge count={free_data.issue_count} onUnlock={!analysis.paid ? onUnlock : undefined} />
      <LineItemTable lineItems={free_data.line_items} />
    </Box>
  )
}
