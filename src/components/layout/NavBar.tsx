import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '@/app/store'
import { useSignOutMutation } from '@/features/auth/authApi'
import { clearSession } from '@/features/auth/authSlice'
import { useMyPack } from '@/hooks/useMyPack'

export function NavBar() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const [signOut] = useSignOutMutation()
  const pack = useMyPack()
  const remaining = pack ? pack.total_credits - pack.used_credits : 0

  const handleSignOut = async () => {
    await signOut()
    dispatch(clearSession())
  }

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
          <Button component={RouterLink} to="/faq" size="small" color="inherit">
            FAQ
          </Button>
          {user ? (
            <>
              {pack && remaining > 0 && (
                <Chip
                  component={RouterLink}
                  to="/pack"
                  label={`${remaining} bill${remaining !== 1 ? 's' : ''} left`}
                  color="primary"
                  size="small"
                  clickable
                />
              )}
              <Button component={RouterLink} to="/pack" size="small">
                My Pack
              </Button>
              <Button onClick={handleSignOut} size="small" color="inherit">
                Sign Out
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
