import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'

export function NavBar() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'primary.main', fontWeight: 700 }}
        >
          FightMyBill
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.email}
              </Typography>
              <Button component={RouterLink} to="/pack" variant="outlined" size="small">
                My Pack
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/login" variant="outlined" size="small">
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
