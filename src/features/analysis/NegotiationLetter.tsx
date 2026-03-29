import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { CopyButton } from '@/components/common/CopyButton'
import type { NegotiationLetter as NegotiationLetterType } from '@/types/analysis.types'

function highlightPlaceholders(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g)
  return parts.map((part, i) =>
    /^\[.+\]$/.test(part) ? (
      <Box
        key={i}
        component="span"
        sx={{
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          px: 0.5,
          borderRadius: 0.5,
          fontWeight: 600,
          fontSize: 'inherit',
        }}
      >
        {part}
      </Box>
    ) : (
      part
    ),
  )
}

interface NegotiationLetterProps {
  letter: NegotiationLetterType
}

export function NegotiationLetter({ letter }: NegotiationLetterProps) {
  const fullText = `Subject: ${letter.subject}\n\n${letter.body}`

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Your negotiation letter
          </Typography>
          <CopyButton text={fullText} size="medium" />
        </Box>

        {letter.placeholders.length > 0 && (
          <Box sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.light', borderRadius: 1, p: 1.5, mb: 2 }}>
            <Typography variant="caption" color="warning.dark" fontWeight={600}>
              Fill in the highlighted sections before sending
            </Typography>
          </Box>
        )}

        <Box sx={{ bgcolor: 'background.default', borderRadius: 1, p: 2, fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Subject: {highlightPlaceholders(letter.subject)}
          </Typography>
          <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {highlightPlaceholders(letter.body)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
