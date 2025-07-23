import { ReactNode } from 'react'
import { LogIn, Loader } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Giriş Gerekli</h1>
            <p className="text-gray-600 mb-6">
              Görev yönetimi sistemini kullanmak için lütfen giriş yapın.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Not:</strong> Bu demo uygulamasında kimlik doğrulama Supabase Auth ile entegre edilmiştir. 
                Gerçek uygulamada burada giriş formu yer alacaktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}