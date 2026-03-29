import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

interface ErrorBannerProps {
  message: string
  title?: string
}

export function ErrorBanner({ message, title = 'Something went wrong' }: ErrorBannerProps) {
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  )
}
