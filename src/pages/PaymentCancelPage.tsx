import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const analysisId = searchParams.get('analysis_id')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2, textAlign: 'center', px: 2 }}>
      <Typography variant="h5" fontWeight={700}>Payment cancelled</Typography>
      <Typography variant="body1" color="text.secondary">
        No charge was made. Your free analysis is still available.
      </Typography>
      {analysisId ? (
        <Button component={RouterLink} to={`/analyze/${analysisId}`} variant="contained" sx={{ mt: 1 }}>
          Back to my analysis
        </Button>
      ) : (
        <Button component={RouterLink} to="/analyze" variant="contained" sx={{ mt: 1 }}>
          Analyze a bill
        </Button>
      )}
    </Box>
  )
}
