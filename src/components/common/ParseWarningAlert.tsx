import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

interface ParseWarningAlertProps {
  warnings: string[]
}

export function ParseWarningAlert({ warnings }: ParseWarningAlertProps) {
  if (!warnings || warnings.length === 0) return null

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>Partial read</AlertTitle>
      {warnings.map((w, i) => (
        <div key={i}>{w}</div>
      ))}
    </Alert>
  )
}
