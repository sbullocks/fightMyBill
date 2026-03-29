import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

interface IssueCountBadgeProps {
  count: number
  onUnlock?: () => void
}

export function IssueCountBadge({ count, onUnlock }: IssueCountBadgeProps) {
  const hasIssues = count > 0

  return (
    <Card
      sx={{
        mb: 3,
        borderLeft: '4px solid',
        borderColor: hasIssues ? 'warning.main' : 'success.main',
        bgcolor: hasIssues ? 'warning.50' : 'success.50',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            {hasIssues ? (
              <WarningAmberIcon color="warning" sx={{ fontSize: 28 }} />
            ) : (
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 28 }} />
            )}
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {hasIssues
                  ? `${count} potential issue${count === 1 ? '' : 's'} detected`
                  : 'No issues detected'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hasIssues
                  ? 'Unlock to see exactly what they are and get your negotiation letter.'
                  : 'Your bill looks clean. We still generated a negotiation letter you can use.'}
              </Typography>
            </Box>
          </Box>
          {onUnlock && (
            <Button variant="contained" color="warning" onClick={onUnlock} sx={{ whiteSpace: 'nowrap' }}>
              Unlock full analysis — $5
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
