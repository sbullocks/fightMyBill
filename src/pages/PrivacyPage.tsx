import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

const LAST_UPDATED = 'March 2026'

export function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {LAST_UPDATED}
      </Typography>

      <Section title="Overview">
        FightMyBill ("we", "us", "our") operates the website at fightmybill.com. This policy
        explains what information we collect when you use our service, how we use it, and your
        rights regarding that information.
      </Section>

      <Section title="What we do NOT store">
        <strong>Your raw medical bill is never stored.</strong> When you upload a PDF, image,
        or pasted text, it is sent directly to our analysis service, processed, and immediately
        discarded. We do not retain, log, or sell the content of your medical bill.
      </Section>

      <Section title="What we do store">
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>
            <strong>Structured analysis results</strong> — the decoded line items, identified
            issues, and negotiation letter generated from your bill. This does not contain your
            raw bill text or images. It is stored for up to 90 days and then automatically
            deleted.
          </li>
          <li>
            <strong>Session ID</strong> — a randomly generated identifier stored in your
            browser's local storage. Used to associate your anonymous analyses with your
            session. No personal information is linked to this ID unless you create an account.
          </li>
          <li>
            <strong>Account information (optional)</strong> — if you create an account, we
            store your email address and a securely hashed password. Your email is used only
            for account authentication and is never sold or shared with third parties for
            marketing.
          </li>
          <li>
            <strong>Payment information</strong> — we do not store your payment card details.
            Payments are processed by Stripe. We receive a payment confirmation and a reference
            ID from Stripe, nothing more. Stripe's privacy policy applies to payment processing.
          </li>
        </ul>
      </Section>

      <Section title="How we use your information">
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>To display your analysis results to you</li>
          <li>To enforce rate limits and prevent abuse</li>
          <li>To track remaining bill pack credits for authenticated users</li>
          <li>To communicate with you about your account if you create one</li>
        </ul>
        We do not use your information for advertising, profiling, or resale.
      </Section>

      <Section title="HIPAA notice">
        FightMyBill is not a Covered Entity or Business Associate under HIPAA. We are an
        informational analysis tool. Because we do not store your raw medical bill and do not
        maintain a medical record on your behalf, HIPAA's technical safeguard requirements do
        not apply to our service in the same way they apply to healthcare providers or health
        plans. However, we take the sensitivity of medical billing information seriously and
        apply the same principle: collect nothing we don't need, retain nothing longer than
        necessary.
      </Section>

      <Section title="Third-party services">
        We use the following third-party services:
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li><strong>Supabase</strong> — database and authentication hosting (US-based)</li>
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>Anthropic</strong> — AI analysis of bill content (bill data is sent to
            Anthropic's API for processing and not retained by Anthropic beyond standard API
            usage logging)</li>
        </ul>
        Each of these providers has their own privacy policy governing their use of data.
      </Section>

      <Section title="Data retention">
        Analysis results are automatically deleted after 90 days. Account data is retained
        for as long as your account is active. You may request deletion of your account and
        associated data at any time by contacting us.
      </Section>

      <Section title="Your rights">
        You have the right to:
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>Access the analysis results associated with your session or account</li>
          <li>Request deletion of your account and stored analyses</li>
          <li>Opt out of any future communications (we send very few)</li>
        </ul>
        To exercise these rights, contact us at the email listed below.
      </Section>

      <Section title="Cookies and local storage">
        We use browser local storage (not cookies) to store your anonymous session ID. We do
        not use tracking cookies, advertising pixels, or third-party analytics scripts.
      </Section>

      <Section title="Children">
        FightMyBill is not intended for use by children under 13. We do not knowingly collect
        personal information from children.
      </Section>

      <Section title="Changes to this policy">
        We may update this policy as our service evolves. We will update the "Last updated"
        date at the top of this page. Continued use of the service after changes constitutes
        acceptance of the updated policy.
      </Section>

      <Section title="Contact">
        For privacy questions or data deletion requests, contact us through the{' '}
        <Link component={RouterLink} to="/faq">FAQ page</Link> or the GitHub repository linked
        in the footer.
      </Section>
    </Container>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
        {children}
      </Typography>
    </Box>
  )
}
