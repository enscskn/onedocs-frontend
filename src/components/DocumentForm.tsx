import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, X, Calendar, User, Sparkles } from 'lucide-react'
import { useDocuments } from '../hooks/useDocuments'
import { useProfiles } from '../hooks/useProfiles'

function getRandomDocumentData(profiles: { id: number }[]): {
  title: string
  content: string
  due_date: string
  assigned_to: number
  created_by: number
} {
  const titles = [
    'Sözleşme Taslağı',
    'Teklif Belgesi',
    'Proje Planı',
    'Toplantı Notları',
    'Rapor Şablonu',
    'Onay Formu',
  ]
  const contents = [
    'Lütfen sözleşme maddelerini gözden geçirin.',
    'Teklif detayları ekte sunulmuştur.',
    'Proje planı ve zaman çizelgesi ektedir.',
    'Toplantı sırasında alınan notlar.',
    'Rapor şablonu güncellenmiştir.',
    'Onay için formu doldurunuz.',
  ]
  const now = new Date()
  const due = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)]
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
    due_date: due.toISOString().slice(0, 16),
    assigned_to: randomProfile?.id || 1,
    created_by: 1,
  }
}

type DocumentFormData = {
  title: string
  content: string
  due_date: string
  assigned_to: number | ''
}

export function DocumentForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createDocument } = useDocuments()
  const { profiles } = useProfiles()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<DocumentFormData>()

  const onSubmit = async (data: DocumentFormData) => {
    try {
      setIsSubmitting(true)
      const docData = {
        title: data.title,
        content: data.content || null,
        due_date: data.due_date || null,
        assigned_to: typeof data.assigned_to === 'number' ? data.assigned_to : 1,
        created_by: 1,
      }
      await createDocument(docData)
      reset()
      setIsOpen(false)
    } catch (error) {
      console.error('Belge oluşturulurken hata oluştu:', error)
      alert('Belge oluşturulurken hata oluştu. Lütfen Supabase bağlantınızı kontrol edin.')
      setIsSubmitting(false)
    }
  }

  const handleAutoFill = () => {
    const random = getRandomDocumentData(profiles)
    setValue('title', random.title || '')
    setValue('content', random.content || '')
    setValue('due_date', random.due_date?.slice(0, 16) || '')
    setValue('assigned_to', random.assigned_to || '')
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Yeni Belge Ekle
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Yeni Belge Oluştur</h3>
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
                className="flex items-center gap-1 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-xs font-medium transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" /> Otomatik Oluştur
              </button>
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Belge Başlığı *
              </label>
              <input
                {...register('title', { required: 'Belge başlığı gereklidir' })}
                type="text"
                id="title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Belge başlığını girin..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                {...register('content')}
                id="content"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Belge içeriğini açıklayın..."
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? 'Oluşturuluyor...' : 'Belge Oluştur'}
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