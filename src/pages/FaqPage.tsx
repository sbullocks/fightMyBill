import { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Link as RouterLink } from 'react-router-dom'

const FAQS = [
  {
    q: 'How does the analysis work?',
    a: `When you upload or paste your bill, we send the text or image to an AI trained on medical billing standards — including CPT codes, ICD-10 diagnosis codes, and Medicare fee schedules. The AI decodes every line item into plain English and checks for common billing errors like duplicate charges, upcoding, and unbundling. The free result shows you the decoded line items and a count of potential issues. Unlocking the full audit reveals each issue in detail and generates a ready-to-send negotiation letter tailored to your specific bill.`,
  },
  {
    q: 'Is my bill information secure?',
    a: `Your raw bill — the PDF, image, or pasted text — is never stored. We send it to the AI for analysis and immediately discard it. Only the structured analysis result (decoded line items and issue descriptions) is saved, and it expires automatically after 90 days. We do not sell or share your data.`,
  },
  {
    q: 'What types of medical bills can I analyze?',
    a: `FightMyBill works on any US medical bill — hospital bills, physician invoices, emergency room bills, specialist visits, outpatient procedure bills, and lab or imaging invoices. We support UB-04 and CMS-1500 claim form formats. The bill can be a PDF, a photo (JPG or PNG), or pasted plain text.`,
  },
  {
    q: 'How accurate is the analysis?',
    a: `The AI is highly effective at decoding billing codes and identifying patterns that commonly indicate errors. However, it cannot know every detail of your specific procedure, so the analysis is best understood as a starting point for your own review — not a definitive audit by a licensed billing professional. When in doubt, contact your provider's billing department and ask them to explain each charge. The negotiation letter is written to prompt that conversation in a professional, factual way.`,
  },
  {
    q: 'What does the free analysis include?',
    a: `The free analysis includes the provider name, bill date, total billed, and every line item decoded into plain English so you can understand what you were charged for. It also shows a count of potential billing issues we found. The full audit — unlocked for $5 — reveals a detailed description of each issue, estimated savings, the specific action you should take for each, and a personalized negotiation letter.`,
  },
  {
    q: 'How do bill pack credits work?',
    a: `A bill pack gives you 3 full analyses for $12 (versus $5 each), valid for 12 months. Credits are applied automatically when you analyze a bill while signed in with an active pack. You can track your remaining credits on the My Pack page. Credits do not roll over after 12 months.`,
  },
  {
    q: 'Do I need an account?',
    a: `No account is required to analyze a single bill. You can upload your bill, see the free result, and pay $5 to unlock the full audit — all without creating an account. An account is required to purchase a bill pack (3 analyses for $12), because the credits need to be attached to your profile.`,
  },
  {
    q: 'What if the billing department ignores my letter?',
    a: `Persistence matters. If you don't get a response within 30 days, follow up by phone and reference the letter you sent. Ask to speak with a patient advocate or financial counselor — most hospitals have one. You can also request an itemized bill in writing (you have a legal right to one in all US states), which often prompts a review. If you believe there is a genuine billing error, you can file a complaint with your state insurance commissioner or the Centers for Medicare & Medicaid Services.`,
  },
  {
    q: 'Can I use this for insurance disputes?',
    a: `The analysis focuses on the bill from your provider, not on insurance claim denials. However, understanding exactly what you were charged for — and whether those charges were correctly coded — is valuable when appealing an insurance decision. The negotiation letter is addressed to the provider's billing department, but you can share the analysis with your insurer as supporting documentation for an appeal.`,
  },
  {
    q: 'I found a billing error. What happens next?',
    a: `Send the negotiation letter to the billing address on your bill. Call to confirm receipt. Most billing departments will review disputed charges and respond within 30 days. If they agree there was an error, they will issue a corrected bill. If they disagree, ask them to explain the charge in writing. Having a documented paper trail significantly strengthens your position.`,
  },
]

export function FaqPage() {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" gutterBottom>
        Frequently asked questions
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Questions about how FightMyBill works, what we analyze, and how to use your results.
      </Typography>

      {FAQS.map((faq, i) => (
        <Accordion
          key={i}
          expanded={expanded === `panel-${i}`}
          onChange={handleChange(`panel-${i}`)}
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px !important',
            mb: 1.5,
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 1.5 }}>
            <Typography fontWeight={600}>{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, pb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {faq.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Still have questions?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload your bill and get a free preview — decoded line items and a count of issues found. Full audit and negotiation letter from $5.
        </Typography>
        <Button component={RouterLink} to="/analyze" variant="contained" size="large">
          Analyze my bill — free
        </Button>
      </Box>
    </Container>
  )
}
