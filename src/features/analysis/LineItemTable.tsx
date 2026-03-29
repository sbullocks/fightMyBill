import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { formatCurrency } from '@/utils/formatCurrency'
import type { LineItem } from '@/types/analysis.types'

interface LineItemTableProps {
  lineItems: LineItem[]
}

export function LineItemTable({ lineItems }: LineItemTableProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Your charges, decoded
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Here's what each line on your bill actually means.
        </Typography>
      </CardContent>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600 }}>Charge</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>What it means</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Billed</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Your cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lineItems.map((item, idx) => (
              <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{item.description}</Typography>
                    {item.cpt_code && (
                      <Chip label={`CPT ${item.cpt_code}`} size="small" sx={{ mt: 0.5, fontSize: '0.7rem' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{item.plain_english}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{formatCurrency(item.billed_amount)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(item.patient_responsibility)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
