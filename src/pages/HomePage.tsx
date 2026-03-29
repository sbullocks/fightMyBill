import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const STEPS = [
  {
    icon: <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Upload or paste your bill',
    body: 'PDF, photo, or paste the text directly. Your raw bill is never stored.',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'FightMyBill audits every line item',
    body: 'We decode CPT codes, flag duplicate charges, upcoding, unbundling, and balance billing violations.',
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Send your negotiation letter',
    body: 'Get a professional, ready-to-send letter that references the exact charges in dispute.',
  },
]

const ISSUES = [
  'Duplicate charges for the same service',
  'Upcoding — billed for a more expensive procedure than performed',
  'Unbundling — one procedure split into multiple charges',
  'Incorrect or missing modifiers',
  'Balance billing violations',
  'Inflated facility and room fees',
]

const TRUST = [
  { icon: <LockOutlinedIcon />, label: 'Raw bill never stored' },
  { icon: <CheckCircleOutlineIcon />, label: 'Works on any US medical bill' },
  {
    icon: <CheckCircleOutlineIcon />,
    label: 'No account required for a single bill',
  },
  { icon: <CheckCircleOutlineIcon />, label: 'Results in under 60 seconds' },
]

export function HomePage() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #1565C0 0%, #0D47A1 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="Most medical bills contain at least one error"
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              color: 'white',
              mb: 3,
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
          >
            Stop overpaying your medical bills
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              mb: 4,
              maxWidth: 540,
              mx: 'auto',
            }}
          >
            FightMyBill audits your bill for errors, then writes the negotiation
            letter for you. Free to try — no account needed.
          </Typography>
          <Button
            component={RouterLink}
            to="/analyze"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'grey.100' },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Analyze my bill — free
          </Button>
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
            No sign-up required. Full audit unlocks for $5.
          </Typography>
        </Container>
      </Box>

      {/* Trust signals */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            {TRUST.map(({ icon, label }) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  color: 'text.secondary',
                }}
              >
                <Box sx={{ color: 'secondary.main', display: 'flex' }}>
                  {icon}
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* How it works */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          How it works
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Three steps from bill to negotiation letter.
        </Typography>
        <Grid container spacing={4}>
          {STEPS.map((step, i) => (
            <Grid key={step.title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={700}
                    letterSpacing={1}
                  >
                    STEP {i + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5, mb: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* What we catch */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" gutterBottom>
            What we look for
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Billing departments make mistakes — and some aren't accidents.
          </Typography>
          <Grid container spacing={2}>
            {ISSUES.map((issue) => (
              <Grid key={issue} size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ color: 'secondary.main', mt: 0.25, flexShrink: 0 }}
                  />
                  <Typography variant="body1">{issue}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Divider />

      {/* Pricing */}
      <Container
        maxWidth="sm"
        sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}
      >
        <Typography variant="h4" gutterBottom>
          Simple pricing
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
          Analyzing your bill is always free. Pay only to unlock the full audit.
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ pt: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" color="text.secondary">
                  Single
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                  $5
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Full audit + negotiation letter for one bill
                </Typography>
                <Button
                  component={RouterLink}
                  to="/analyze"
                  variant="outlined"
                  fullWidth
                >
                  Get started
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card
              sx={{
                border: '2px solid',
                borderColor: 'primary.main',
                position: 'relative',
              }}
            >
              <Chip
                label="Best value"
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" color="text.secondary">
                  Pack
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                  $12
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  3 full audits — valid for 12 months
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  fullWidth
                >
                  Get bill pack
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Bottom CTA */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h5" gutterBottom>
            Your free analysis is waiting
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, mb: 3 }}>
            Upload your bill now. No account, no commitment.
          </Typography>
          <Button
            component={RouterLink}
            to="/analyze"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.dark',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Analyze my bill
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
