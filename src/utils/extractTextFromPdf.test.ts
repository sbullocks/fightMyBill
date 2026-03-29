import { describe, it, expect, vi } from 'vitest'

// Mock pdfjs-dist before importing the module under test
vi.mock('pdfjs-dist', () => ({
  default: {},
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(),
}))

import { extractTextFromPdf } from './extractTextFromPdf'
import * as pdfjsLib from 'pdfjs-dist'

describe('extractTextFromPdf', () => {
  it('extracts and joins text from all pages', async () => {
    const mockPage = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: 'Line 1' }, { str: ' Line 2' }],
      }),
    }
    const mockPdf = {
      numPages: 2,
      getPage: vi.fn().mockResolvedValue(mockPage),
    }
    vi.mocked(pdfjsLib.getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as ReturnType<typeof pdfjsLib.getDocument>)

    const file = new File(['dummy'], 'bill.pdf', { type: 'application/pdf' })
    const result = await extractTextFromPdf(file)

    expect(result).toContain('Line 1')
    expect(result).toContain('Line 2')
    expect(mockPdf.getPage).toHaveBeenCalledWith(1)
    expect(mockPdf.getPage).toHaveBeenCalledWith(2)
  })

  it('returns empty string when PDF has no text items', async () => {
    const mockPage = {
      getTextContent: vi.fn().mockResolvedValue({ items: [] }),
    }
    const mockPdf = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue(mockPage),
    }
    vi.mocked(pdfjsLib.getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdf),
    } as ReturnType<typeof pdfjsLib.getDocument>)

    const file = new File(['dummy'], 'empty.pdf', { type: 'application/pdf' })
    const result = await extractTextFromPdf(file)
    expect(result).toBe('')
  })
})
