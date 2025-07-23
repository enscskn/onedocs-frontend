import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, X, Calendar, User, Sparkles } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useProfiles } from '../hooks/useProfiles'
import type { Database } from '../lib/supabase'

function getRandomTaskData(profiles: any[]): Partial<Database['public']['Tables']['tasks']['Insert']> {
  const titles = [
    'Sunum Hazırlığı',
    'Rapor Teslimi',
    'Toplantı Planlama',
    'Kod İncelemesi',
    'Müşteri Görüşmesi',
    'Test Senaryosu Yazımı',
  ]
  const descriptions = [
    'Detaylı bir sunum hazırlanacak.',
    'Aylık rapor teslim edilecek.',
    'Takım toplantısı organize edilecek.',
    'Kodlar gözden geçirilecek.',
    'Müşteri ile görüşme yapılacak.',
    'Testler yazılıp çalıştırılacak.',
  ]
  const now = new Date()
  const due = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)]
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    due_date: due.toISOString().slice(0, 16),
    assigned_to: randomProfile?.id || 1,
    created_by: 1,
    status: 'pending',
  }
}

type TaskFormData = {
  title: string
  description: string
  due_date: string
  assigned_to: number | ''
}

export function TaskForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createTask } = useTasks()
  const { profiles } = useProfiles()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TaskFormData>()

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true)
      const taskData: Database['public']['Tables']['tasks']['Insert'] = {
        title: data.title,
        description: data.description || null,
        due_date: data.due_date || null,
        assigned_to: typeof data.assigned_to === 'number' ? data.assigned_to : 1,
        created_by: 1,
        status: 'pending',
      }
      await createTask(taskData)
      reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Görev oluşturulurken hata oluştu. Lütfen Supabase bağlantınızı kontrol edin.')
      setIsSubmitting(false)
    }
  }

  const handleAutoFill = () => {
    const random = getRandomTaskData(profiles)
    setValue('title', random.title || '')
    setValue('description', random.description || '')
    setValue('due_date', random.due_date?.slice(0, 16) || '')
    setValue('assigned_to', random.assigned_to || '')
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Yeni Görev Ekle
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Yeni Görev Oluştur</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={handleAutoFill}
                className="flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" /> Otomatik Oluştur
              </button>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Görev Başlığı *
              </label>
              <input
                {...register('title', { required: 'Görev başlığı gereklidir' })}
                type="text"
                id="title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Görev başlığını girin..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Görev detaylarını açıklayın..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Teslim Tarihi
                </label>
                <input
                  {...register('due_date')}
                  type="datetime-local"
                  id="due_date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Atanan Kişi
                </label>
                <select
                  {...register('assigned_to')}
                  id="assigned_to"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Kişi seçin...</option>
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.full_name || profile.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? 'Oluşturuluyor...' : 'Görev Oluştur'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  reset()
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}