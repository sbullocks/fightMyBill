import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useSearchParams } from 'react-router-dom'
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling'

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const analysisId = searchParams.get('analysis_id')

  useAnalysisPolling(analysisId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <CircularProgress size={48} />
      <Typography variant="h6">Verifying your payment…</Typography>
      <Typography variant="body2" color="text.secondary">
        You'll be redirected to your full analysis in a moment.
      </Typography>
    </Box>
  )
}
