import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useDispatch } from 'react-redux'
import { useSignInMutation } from '@/features/auth/authApi'
import { setSession } from '@/features/auth/authSlice'
import { ErrorBanner } from '@/components/common/ErrorBanner'
import type { AppDispatch } from '@/app/store'

export function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signIn, { isLoading, error }] = useSignInMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await signIn({ email, password }).unwrap()
      dispatch(setSession({ user: result.user, session: result.session }))
      navigate('/pack')
    } catch {
      // error shown via RTK Query error state
    }
  }

  const apiError = error
    ? ('data' in (error as object) ? ((error as { data?: { error?: string } }).data?.error) : undefined) ?? 'Sign in failed. Check your email and password.'
    : null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 6 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Sign in</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access your bill pack credits.
          </Typography>

          {apiError && <ErrorBanner message={apiError} />}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
              Create one
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
