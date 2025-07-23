import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Email = Database['public']['Tables']['emails']['Row']

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setEmails(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const createEmail = async (email: Database['public']['Tables']['emails']['Insert']) => {
    try {
      const { error } = await supabase.from('emails').insert([email])
      if (error) throw error
      await fetchEmails()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  const updateEmail = async (id: number, updates: Database['public']['Tables']['emails']['Update']) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      await fetchEmails()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  const deleteEmail = async (id: number) => {
    try {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchEmails()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  return {
    emails,
    loading,
    error,
    fetchEmails,
    createEmail,
    updateEmail,
    deleteEmail
  }
} 