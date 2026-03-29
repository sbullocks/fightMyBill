import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

interface NegotiationTipsListProps {
  tips: string[]
}

export function NegotiationTipsList({ tips }: NegotiationTipsListProps) {
  if (!tips || tips.length === 0) return null

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Negotiation tips
        </Typography>
        {tips.map((tip, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
            <LightbulbOutlinedIcon color="warning" sx={{ mt: 0.25, flexShrink: 0 }} />
            <Typography variant="body2">{tip}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}
