import { useState } from 'react'
import { Calendar, User, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useEmails } from '../hooks/useEmails'
import type { Database } from '../lib/supabase'

type Email = Database['public']['Tables']['emails']['Row'] & {
  assigned_to_profile?: Database['public']['Tables']['profiles']['Row']
  created_by_profile?: Database['public']['Tables']['profiles']['Row']
}

interface EmailCardProps {
  email: Email
}

export function EmailCard({ email }: EmailCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { deleteEmail } = useEmails()

  const handleDelete = async () => {
    if (!confirm('Bu e-postayı silmek istediğinizden emin misiniz?')) return
    try {
      setIsLoading(true)
      await deleteEmail(email.id)
    } catch (error) {
      console.error('E-posta silinirken hata oluştu:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">
          {email.subject}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-all duration-200"
            title="E-postayı sil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {email.body && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {email.body}
        </p>
      )}

      <div className="space-y-3 text-sm text-gray-600">
        {email.due_date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              Teslim: {format(new Date(email.due_date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
            </span>
          </div>
        )}

        {email.assigned_to_profile && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>
              Atanan: {email.assigned_to_profile.full_name || email.assigned_to_profile.email}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            Oluşturan: {email.created_by_profile?.full_name || email.created_by_profile?.email}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {format(new Date(email.created_at), 'dd MMMM yyyy', { locale: tr })}
          </span>
        </div>
      </div>
    </div>
  )
} 