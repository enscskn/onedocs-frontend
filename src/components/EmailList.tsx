import { Search, RefreshCw } from 'lucide-react'
import { useState, useMemo } from 'react'
import { EmailCard } from './EmailCard'
import { useEmails } from '../hooks/useEmails'

export function EmailList() {
  const { emails, loading, error, fetchEmails } = useEmails()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.body?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      return matchesSearch
    })
  }, [emails, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <span className="ml-3 text-gray-600">E-postalar yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 mb-4">E-postalar yüklenirken hata oluştu: {error}</p>
        <button
          onClick={fetchEmails}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">E-postalar</h2>
          <p className="text-gray-600 mt-1">
            {filteredEmails.length} e-posta bulundu
          </p>
        </div>
        <button
          onClick={fetchEmails}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="E-postalarda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Grid */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'Arama kriterlerine uygun e-posta bulunamadı' : 'Henüz e-posta yok'}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'Farklı arama kriterleri deneyin'
              : 'İlk e-postanızı oluşturmak için yukarıdaki butona tıklayın'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmails.map((email) => (
            <EmailCard key={email.id} email={email} />
          ))}
        </div>
      )}
    </div>
  )
} 