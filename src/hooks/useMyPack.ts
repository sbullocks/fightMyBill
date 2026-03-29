import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabaseClient'
import type { RootState } from '@/app/store'
import type { BillPack } from '@/types/payment.types'

export function useMyPack(): BillPack | null {
  const user = useSelector((state: RootState) => state.auth.user)
  const [pack, setPack] = useState<BillPack | null>(null)

  useEffect(() => {
    if (!user) {
      setPack(null)
      return
    }

    supabase
      .from('bill_packs')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setPack(data))
  }, [user])

  return pack
}
