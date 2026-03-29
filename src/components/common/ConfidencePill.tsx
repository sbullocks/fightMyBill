import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import type { Confidence } from '@/types/analysis.types'

const CONFIG: Record<Confidence, { label: string; color: 'success' | 'warning' | 'error'; tooltip: string }> = {
  high: {
    label: 'High confidence',
    color: 'success',
    tooltip: 'The bill was clearly readable and fully parsed.',
  },
  medium: {
    label: 'Medium confidence',
    color: 'warning',
    tooltip: 'Some line items may be unclear. Review carefully.',
  },
  low: {
    label: 'Low confidence',
    color: 'error',
    tooltip: 'The bill was difficult to read. Results may be incomplete.',
  },
}

interface ConfidencePillProps {
  confidence: Confidence
}

export function ConfidencePill({ confidence }: ConfidencePillProps) {
  const { label, color, tooltip } = CONFIG[confidence]
  return (
    <Tooltip title={tooltip} arrow>
      <Chip label={label} color={color} size="small" variant="outlined" />
    </Tooltip>
  )
}
