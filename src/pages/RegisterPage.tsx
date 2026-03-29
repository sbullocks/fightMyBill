import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { useSignUpMutation } from '@/features/auth/authApi'
import { ErrorBanner } from '@/components/common/ErrorBanner'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [signUp, { isLoading, error }] = useSignUpMutation()

  const passwordMismatch = confirm.length > 0 && password !== confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordMismatch) return
    try {
      await signUp({ email, password }).unwrap()
      setSubmitted(true)
    } catch {
      // error shown via RTK Query error state
    }
  }

  const apiError = error
    ? ('data' in error ? (error.data as { error?: string })?.error : undefined) ?? 'Registration failed. Please try again.'
    : null

  if (submitted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 6 }}>
        <Card sx={{ width: '100%', maxWidth: 420 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Check your email</Typography>
            <Typography variant="body2" color="text.secondary">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
            </Typography>
            <Button component={RouterLink} to="/login" variant="contained" sx={{ mt: 3 }}>
              Go to sign in
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, py: 6 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Create account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Required for the bill pack (3 bills for $12).
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
              inputProps={{ minLength: 6 }}
              helperText="Minimum 6 characters"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              fullWidth
              error={passwordMismatch}
              helperText={passwordMismatch ? 'Passwords do not match' : ''}
              autoComplete="new-password"
            />
            {passwordMismatch && (
              <Alert severity="error" sx={{ py: 0 }}>Passwords do not match</Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading || !email || !password || !confirm || passwordMismatch}
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <RouterLink to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Sign in
            </RouterLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
