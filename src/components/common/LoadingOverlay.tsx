import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

interface LoadingOverlayProps {
  open: boolean
  message?: string
}

export function LoadingOverlay({ open, message = 'Analyzing your bill…' }: LoadingOverlayProps) {
  return (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff', flexDirection: 'column', gap: 2 }}>
      <CircularProgress color="inherit" />
      <Typography variant="body1">{message}</Typography>
    </Backdrop>
  )
}
