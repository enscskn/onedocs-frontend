import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('Supabase configuration missing. Please update your .env file with:')
  console.error('VITE_SUPABASE_URL=your_actual_supabase_url')
  console.error('VITE_SUPABASE_ANON_KEY=your_actual_anon_key')
  throw new Error('Please configure Supabase environment variables in .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number
          email: string
          password: string
          full_name: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          password: string
          full_name?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          password?: string
          full_name?: string | null
          role?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          title: string
          description: string | null
          status: string
          due_date: string | null
          assigned_to: number
          created_by: number
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          status?: string
          due_date?: string | null
          assigned_to: number
          created_by: number
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          status?: string
          due_date?: string | null
          assigned_to?: number
          created_by?: number
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: number
          title: string
          content: string | null
          assigned_to: number
          created_by: number
          due_date: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          content?: string | null
          assigned_to: number
          created_by: number
          due_date?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string | null
          assigned_to?: number
          created_by?: number
          due_date?: string | null
          status?: string
          created_at?: string
        }
      }
      emails: {
        Row: {
          id: number
          subject: string
          body: string | null
          assigned_to: number
          created_by: number
          status: string
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          subject: string
          body?: string | null
          assigned_to: number
          created_by: number
          status?: string
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          subject?: string
          body?: string | null
          assigned_to?: number
          created_by?: number
          status?: string
          due_date?: string | null
          created_at?: string
        }
      }
    }
  }
}