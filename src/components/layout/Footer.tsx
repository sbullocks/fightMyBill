import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        FightMyBill is not a law firm and does not provide legal advice.{' '}
        <Link component={RouterLink} to="/faq">
          Learn more
        </Link>
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
        © {new Date().getFullYear()} FightMyBill. Your bill is processed securely and never stored.
      </Typography>
    </Box>
  )
}
