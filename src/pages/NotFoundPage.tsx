import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Box sx={{ p: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
        Go Home
      </Button>
    </Box>
  )
}
