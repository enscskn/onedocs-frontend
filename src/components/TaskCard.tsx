import { useState } from 'react'
import { Calendar, User, Clock, Edit3, Trash2, Check } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useTasks } from '../hooks/useTasks'
import type { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assigned_to_profile?: Database['public']['Tables']['profiles']['Row']
  created_by_profile?: Database['public']['Tables']['profiles']['Row']
}

interface TaskCardProps {
  task: Task
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
}

const statusLabels = {
  pending: 'Bekliyor',
  completed: 'Tamamlandı',
}

export function TaskCard({ task }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { updateTask, deleteTask } = useTasks()

  const canEdit = true // Auth kaldırıldığı için tüm kullanıcılar düzenleyebilir
  const canDelete = true // Auth kaldırıldığı için tüm kullanıcılar silebilir

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true)
      await updateTask(task.id, { status: newStatus })
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) return
    
    try {
      setIsLoading(true)
      await deleteTask(task.id)
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 leading-tight">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          {canEdit && task.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isLoading}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
              title="Tamamlandı olarak işaretle"
            >
              <Check className="w-5 h-5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Görevi sil"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            statusColors[task.status as keyof typeof statusColors]
          }`}
        >
          {statusLabels[task.status as keyof typeof statusLabels]}
        </span>
        
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        {task.due_date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              Teslim: {format(new Date(task.due_date), 'dd MMMM yyyy, HH:mm', { locale: tr })}
            </span>
          </div>
        )}

        {task.assigned_to_profile && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>
              Atanan: {task.assigned_to_profile.full_name || task.assigned_to_profile.email}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            Oluşturan: {task.created_by_profile?.full_name || task.created_by_profile?.email}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {format(new Date(task.created_at), 'dd MMMM yyyy', { locale: tr })}
          </span>
        </div>
      </div>
    </div>
  )
}