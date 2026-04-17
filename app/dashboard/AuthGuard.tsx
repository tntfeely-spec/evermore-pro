"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthGuard({
  children
}: {
  children: React.ReactNode
}) {
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/pro/login'
      } else {
        setAuthed(true)
      }
      setChecked(true)
    })
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!authed) return null

  return <>{children}</>
}
