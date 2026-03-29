import { useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector } from 'react-redux'
import { PricingCards } from './PricingCards'
import { useCreateCheckoutMutation } from './paymentApi'
import { useSessionId } from '@/hooks/useSessionId'
import type { RootState } from '@/app/store'
import type { ProductType } from '@/types/payment.types'

interface PaywallModalProps {
  open: boolean
  onClose: () => void
  analysisId: string
}

export function PaywallModal({ open, onClose, analysisId }: PaywallModalProps) {
  const sessionId = useSessionId()
  const user = useSelector((state: RootState) => state.auth.user)
  const navigate = useNavigate()
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation()

  const handleSelect = async (productType: ProductType) => {
    if (productType === 'pack' && !user) {
      onClose()
      navigate('/login')
      return
    }

    const origin = window.location.origin
    try {
      const result = await createCheckout({
        analysis_id: analysisId,
        product_type: productType,
        session_id: sessionId,
        success_url: `${origin}/payment/success?analysis_id=${analysisId}`,
        cancel_url: `${origin}/analyze/${analysisId}`,
        user_id: user?.id,
      }).unwrap()
      window.location.href = result.checkout_url
    } catch {
      // error handled by RTK Query
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Unlock your full analysis
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          See exactly what's wrong with your bill and get a personalized negotiation letter you can send today.
        </Typography>
        {!user && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            The bill pack requires an account. You'll be prompted to sign in.
          </Typography>
        )}
        <PricingCards onSelect={handleSelect} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
