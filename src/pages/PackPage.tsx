import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import { useMyPack } from '@/hooks/useMyPack'
import { useCreateCheckoutMutation } from '@/features/payment/paymentApi'
import { useSessionId } from '@/hooks/useSessionId'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'

export function PackPage() {
  const pack = useMyPack()
  const sessionId = useSessionId()
  const user = useSelector((state: RootState) => state.auth.user)
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation()

  const remaining = pack ? pack.total_credits - pack.used_credits : 0
  const progress = pack ? (pack.used_credits / pack.total_credits) * 100 : 0

  const handleBuyPack = async () => {
    if (!user) return
    const origin = window.location.origin
    const result = await createCheckout({
      analysis_id: 'pack-purchase',
      product_type: 'pack',
      session_id: sessionId,
      success_url: `${origin}/pack?purchased=true`,
      cancel_url: `${origin}/pack`,
    }).unwrap()
    // Validate the URL is a Stripe checkout URL before redirecting
    if (result.checkout_url.startsWith('https://checkout.stripe.com/')) {
      window.location.href = result.checkout_url
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Bill Pack
      </Typography>

      {pack ? (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {remaining} bill{remaining !== 1 ? 's' : ''} remaining
            </Typography>
            <LinearProgress
              variant="determinate"
              value={100 - progress}
              sx={{ height: 8, borderRadius: 4, my: 2 }}
              color={remaining > 0 ? 'primary' : 'error'}
            />
            <Typography variant="body2" color="text.secondary">
              {pack.used_credits} of {pack.total_credits} bills used
            </Typography>
            {remaining === 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  You've used all your credits.
                </Typography>
                <Button variant="contained" onClick={handleBuyPack} disabled={isLoading} sx={{ mt: 1 }}>
                  Get another pack — $12
                </Button>
              </Box>
            )}
            {remaining > 0 && (
              <Button
                component={RouterLink}
                to="/analyze"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Analyze a bill
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              You don't have an active bill pack.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get 3 full analyses for $12 — valid for 12 months.
            </Typography>
            <Button variant="contained" onClick={handleBuyPack} disabled={isLoading}>
              Get Bill Pack — $12
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
