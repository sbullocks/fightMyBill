import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import { Link as RouterLink } from 'react-router-dom'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          px: 3,
          py: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
          FightMyBill provides informational analysis only — not legal, medical, or professional
          billing advice. Analysis results may not reflect every billing rule applicable to your
          specific payer or contract.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Link component={RouterLink} to="/faq" variant="body2" color="text.secondary" underline="hover">
            FAQ
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link component={RouterLink} to="/privacy" variant="body2" color="text.secondary" underline="hover">
            Privacy
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link component={RouterLink} to="/terms" variant="body2" color="text.secondary" underline="hover">
            Terms
          </Link>
        </Box>
      </Box>
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 1.5, textAlign: 'center' }}>
        <Typography variant="caption" color="text.disabled">
          © {new Date().getFullYear()} FightMyBill. Your bill is processed and immediately discarded — never stored.
        </Typography>
      </Box>
    </Box>
  )
}
