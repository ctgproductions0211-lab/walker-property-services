'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Pulls fresh job data every minute and whenever the tab regains focus.
export default function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000)
    const onFocus = () => router.refresh()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', onFocus)
    }
  }, [router, seconds])
  return null
}
