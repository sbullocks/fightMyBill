import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Issue, Severity, IssueType } from '@/types/analysis.types'

const SEVERITY_COLOR: Record<Severity, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
}

const TYPE_LABEL: Record<IssueType, string> = {
  duplicate: 'Duplicate charge',
  upcoding: 'Upcoding',
  unbundling: 'Unbundled charges',
  incorrect_modifier: 'Incorrect modifier',
  balance_billing: 'Balance billing violation',
  itemization_error: 'Itemization error',
  other: 'Other issue',
}

interface IssueDetailPanelProps {
  issues: Issue[]
  totalSavings: number | null
}

export function IssueDetailPanel({ issues, totalSavings }: IssueDetailPanelProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            Issues found on your bill
          </Typography>
          {totalSavings !== null && totalSavings > 0 && (
            <Chip
              label={`Up to ${formatCurrency(totalSavings)} in potential savings`}
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
      {issues.map((issue) => (
        <Accordion key={issue.id} disableGutters elevation={0} sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={issue.severity.toUpperCase()}
                color={SEVERITY_COLOR[issue.severity]}
                size="small"
              />
              <Typography variant="body2" fontWeight={600}>
                {TYPE_LABEL[issue.type]}
              </Typography>
              {issue.estimated_savings !== null && (
                <Typography variant="body2" color="success.main" fontWeight={500}>
                  ~{formatCurrency(issue.estimated_savings)} savings
                </Typography>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 1.5 }}>{issue.description}</Typography>
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                WHAT TO DO
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{issue.action}</Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Card>
  )
}
