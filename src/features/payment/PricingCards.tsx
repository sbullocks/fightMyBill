import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import type { ProductType } from '@/types/payment.types'

interface PricingCardsProps {
  onSelect: (productType: ProductType) => void
  isLoading: boolean
}

const FEATURES = [
  'Every charge decoded in plain English',
  'Exact issues identified with severity',
  'Estimated savings per issue',
  'Ready-to-send negotiation letter',
  'Practical tips for your negotiation',
]

export function PricingCards({ onSelect, isLoading }: PricingCardsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
      <Card variant="outlined" sx={{ flex: 1, position: 'relative' }}>
        <CardContent>
          <Typography variant="overline" color="text.secondary">Single bill</Typography>
          <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
            $5
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            One-time unlock for this bill
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {FEATURES.map((f) => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckIcon fontSize="small" color="success" />
              <Typography variant="body2">{f}</Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
            onClick={() => onSelect('single')}
          >
            Unlock for $5
          </Button>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{ flex: 1, borderColor: 'primary.main', borderWidth: 2, position: 'relative' }}
      >
        <Chip
          label="Best value"
          color="primary"
          size="small"
          sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}
        />
        <CardContent>
          <Typography variant="overline" color="text.secondary">Bill pack</Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, my: 1 }}>
            <Typography variant="h4" fontWeight={700}>$12</Typography>
            <Typography variant="body2" color="text.secondary">/ 3 bills</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            $4/bill — valid 12 months
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {FEATURES.map((f) => (
            <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckIcon fontSize="small" color="success" />
              <Typography variant="body2">{f}</Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
            onClick={() => onSelect('pack')}
          >
            Get 3 bills for $12
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
