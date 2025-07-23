import { useState } from 'react'
import { Calendar, User, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useDocuments } from '../hooks/useDocuments'
import type { Database } from '../lib/supabase'

type Document = Database['public']['Tables']['contracts']['Row'] & {
  assigned_to_profile?: Database['public']['Tables']['profiles']['Row']
  created_by_profile?: Database['public']['Tables']['profiles']['Row']
}

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { deleteDocument } = useDocuments()

  const handleDelete = async () => {
    if (!confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) return
    try {
      setIsLoading(true)
      await deleteDocument(document.id)
    } catch (error) {
      console.error('Belge silinirken hata oluştu:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 leading-tight">
          {document.title}
        </h3>
        <div className="flex items-center gap-2">
          {/* Güncelleme butonu ileride eklenebilir */}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Belgeyi sil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {document.content && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {document.content}
        </p>
      )}

      <div className="space-y-3 text-sm text-gray-600">
        {document.due_date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              Teslim: {format(new Date(document.due_date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
            </span>
          </div>
        )}

        {document.assigned_to_profile && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>
              Atanan: {document.assigned_to_profile.full_name || document.assigned_to_profile.email}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            Oluşturan: {document.created_by_profile?.full_name || document.created_by_profile?.email}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {format(new Date(document.created_at), 'dd MMMM yyyy', { locale: tr })}
          </span>
        </div>
      </div>
    </div>
  )
} 