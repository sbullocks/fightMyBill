import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams } from 'react-router-dom'
import { UploadForm } from '@/features/analysis/UploadForm'
import { AnalysisResults } from '@/features/analysis/AnalysisResults'
import { ErrorBanner } from '@/components/common/ErrorBanner'
import { useGetAnalysisQuery } from '@/features/analysis/analysisApi'

function AnalysisResultsView({ analysisId }: { analysisId: string }) {
  const { data, isLoading, error } = useGetAnalysisQuery(analysisId)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !data) {
    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: 4 }}>
        <ErrorBanner message="Could not load this analysis. The link may have expired." />
      </Box>
    )
  }

  return <AnalysisResults analysis={data} />
}

export function AnalyzePage() {
  const { analysisId } = useParams<{ analysisId?: string }>()

  if (analysisId) {
    return <AnalysisResultsView analysisId={analysisId} />
  }

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Box sx={{ maxWidth: 640, mx: 'auto', mb: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Founding offer:</strong> full analyses are free for early users — no payment required.
        </Alert>
        <Alert severity="warning" variant="outlined" icon={false} sx={{ fontSize: '0.8rem', py: 0.75 }}>
          Informational tool only — not legal, medical, or professional billing advice.
        </Alert>
      </Box>
      <UploadForm />
    </Box>
  )
}
