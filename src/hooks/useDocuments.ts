import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Document = Database['public']['Tables']['contracts']['Row']

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setDocuments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const createDocument = async (doc: Database['public']['Tables']['contracts']['Insert']) => {
    try {
      const { error } = await supabase.from('contracts').insert([doc])
      if (error) throw error
      await fetchDocuments()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  const updateDocument = async (id: number, updates: Database['public']['Tables']['contracts']['Update']) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      await fetchDocuments()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  const deleteDocument = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id)
      if (error) throw error
      await fetchDocuments()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Bir hata oluştu')
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument
  }
} 