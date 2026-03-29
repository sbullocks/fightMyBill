import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { ConfidencePill } from '@/components/common/ConfidencePill'
import { formatCurrency } from '@/utils/formatCurrency'
import type { FreeData } from '@/types/analysis.types'

interface ProviderSummaryCardProps {
  freeData: FreeData
}

export function ProviderSummaryCard({ freeData }: ProviderSummaryCardProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {freeData.provider_name || 'Unknown Provider'}
            </Typography>
            {freeData.bill_date && (
              <Typography variant="body2" color="text.secondary">
                Bill date: {freeData.bill_date}
              </Typography>
            )}
          </Box>
          <ConfidencePill confidence={freeData.confidence} />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Total Billed</Typography>
            <Typography variant="h6" fontWeight={700}>
              {formatCurrency(freeData.total_billed)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Your Responsibility</Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatCurrency(freeData.total_due)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
