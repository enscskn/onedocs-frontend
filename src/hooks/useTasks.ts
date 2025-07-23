import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assigned_to_profile?: Database['public']['Tables']['profiles']['Row']
  created_by_profile?: Database['public']['Tables']['profiles']['Row']
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to_profile:profiles!tasks_assigned_to_fkey(id, full_name, email),
          created_by_profile:profiles!tasks_created_by_fkey(id, full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: Database['public']['Tables']['tasks']['Insert']) => {
    try {
      const { error } = await supabase.from('tasks').insert([task])
      if (error) throw error
      await fetchTasks() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const updateTask = async (id: number, updates: Database['public']['Tables']['tasks']['Update']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      await fetchTasks() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchTasks() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred')
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}