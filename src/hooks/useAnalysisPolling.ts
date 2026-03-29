import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePollAnalysisQuery } from '@/features/analysis/analysisApi'

export function useAnalysisPolling(analysisId: string | null) {
  const navigate = useNavigate()
  const [active, setActive] = useState(true)

  const { data, isLoading } = usePollAnalysisQuery(analysisId ?? '', {
    skip: !analysisId || !active,
    pollingInterval: 3000,
  })

  useEffect(() => {
    if (data?.paid && analysisId) {
      setActive(false)
      navigate(`/analyze/${analysisId}`)
    }
  }, [data?.paid, analysisId, navigate])

  return { isLoading, isPaid: data?.paid ?? false }
}
