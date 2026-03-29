import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { useSubmitBillMutation } from './analysisApi'
import { extractTextFromPdf } from '@/utils/extractTextFromPdf'
import { LoadingOverlay } from '@/components/common/LoadingOverlay'
import { ErrorBanner } from '@/components/common/ErrorBanner'
import { useSessionId } from '@/hooks/useSessionId'

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_FILE_SIZE_MB = 10
const MAX_TEXT_LENGTH = 50_000

type TabValue = 'upload' | 'paste'

interface SelectedFile {
  file: File
  type: 'pdf' | 'image'
}

export function UploadForm() {
  const [tab, setTab] = useState<TabValue>('upload')
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [pasteText, setPasteText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  useSessionId()

  const [submitBill, { isLoading, error }] = useSubmitBillMutation()

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only PDF, JPG, and PNG files are accepted.'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be under ${MAX_FILE_SIZE_MB}MB.`
    }
    return null
  }

  const handleFile = useCallback((file: File) => {
    const err = validateFile(file)
    if (err) {
      setFileError(err)
      setSelectedFile(null)
      return
    }
    setFileError(null)
    setSelectedFile({ file, type: file.type === 'application/pdf' ? 'pdf' : 'image' })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const isSubmitDisabled = isLoading ||
    (tab === 'upload' && !selectedFile) ||
    (tab === 'paste' && pasteText.trim().length < 50)

  const handleSubmit = async () => {
    const formData = new FormData()

    if (tab === 'paste') {
      formData.append('bill_type', 'text')
      formData.append('text', pasteText.trim())
    } else if (selectedFile) {
      if (selectedFile.type === 'pdf') {
        const text = await extractTextFromPdf(selectedFile.file)
        if (!text || text.length < 20) {
          setFileError('Could not extract text from this PDF. Try pasting the bill text instead.')
          return
        }
        formData.append('bill_type', 'text')
        formData.append('text', text)
      } else {
        formData.append('bill_type', 'image')
        formData.append('file', selectedFile.file)
      }
    }

    try {
      const result = await submitBill(formData).unwrap()
      navigate(`/analyze/${result.id}`)
    } catch {
      // error handled via RTK Query error state
    }
  }

  const apiError = error
    ? ('data' in error
        ? (error.data as { error?: string })?.error ?? 'Analysis failed. Please try again.'
        : 'Analysis failed. Please try again.')
    : null

  return (
    <>
      <LoadingOverlay open={isLoading} />
      <Card sx={{ maxWidth: 640, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Analyze your medical bill
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a PDF or photo, or paste your bill text. We'll decode every charge and find what's negotiable.
          </Typography>

          {apiError && <ErrorBanner message={apiError} />}

          <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Upload file" value="upload" />
            <Tab label="Paste text" value="paste" />
          </Tabs>

          {tab === 'upload' && (
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : fileError ? 'error.main' : 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragging ? 'primary.50' : 'background.default',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              {selectedFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <InsertDriveFileIcon color="primary" />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" fontWeight={600}>{selectedFile.file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(selectedFile.file.size / 1024).toFixed(0)} KB
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  <UploadFileIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Drag & drop your bill here, or <strong>click to browse</strong>
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    PDF, JPG, PNG — max {MAX_FILE_SIZE_MB}MB
                  </Typography>
                </>
              )}
            </Box>
          )}

          {fileError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {fileError}
            </Typography>
          )}

          {tab === 'paste' && (
            <TextField
              multiline
              fullWidth
              minRows={8}
              maxRows={16}
              placeholder="Paste your bill text here…"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value.slice(0, MAX_TEXT_LENGTH))}
              helperText={`${pasteText.length.toLocaleString()} / ${MAX_TEXT_LENGTH.toLocaleString()} characters`}
            />
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Analyze my bill
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
