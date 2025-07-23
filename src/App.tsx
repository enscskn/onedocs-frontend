import { useState } from 'react'
import { CheckSquare, BarChart3, Settings, Bell, FileText, Mail, X } from 'lucide-react'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { DocumentForm } from './components/DocumentForm'
import { DocumentList } from './components/DocumentList'
import { EmailForm } from './components/EmailForm'
import { EmailList } from './components/EmailList'

const TABS = [
  { key: 'tasks', label: 'Görevler', icon: <CheckSquare className="w-5 h-5 mr-2" /> },
  { key: 'documents', label: 'Belgeler', icon: <FileText className="w-5 h-5 mr-2" /> },
  { key: 'emails', label: 'E-postalar', icon: <Mail className="w-5 h-5 mr-2" /> },
]

function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [showNotification, setShowNotification] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Bildirim Toast */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-blue-200 shadow-lg rounded-xl px-6 py-4 flex items-center gap-3 animate-fade-in">
          <Bell className="w-5 h-5 text-blue-600" />
          <span className="text-gray-800 font-medium">Hiç yeni bildiriminiz yok!</span>
          <button onClick={() => setShowNotification(false)} className="ml-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      {/* Modal: İstatistikler */}
      {showStats && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-xs relative">
            <button onClick={() => setShowStats(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <BarChart3 className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">İstatistikler</h2>
            <p className="text-gray-600 text-center">İstatistikler yakında!</p>
          </div>
        </div>
      )}
      {/* Modal: Ayarlar */}
      {showSettings && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-xs relative">
            <button onClick={() => setShowSettings(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <Settings className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Ayarlar</h2>
            <p className="text-gray-600 text-center">Ayarlar yakında!</p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <img src="./public/onedocsturkiye_logo.jpg" alt="OneDocs Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Onedocs</h1>
                <p className="text-sm text-gray-600">Görev Yönetim Sistemi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                onClick={() => setShowNotification(true)}
                title="Bildirimler"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                onClick={() => setShowStats(true)}
                title="İstatistikler"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                onClick={() => setShowSettings(true)}
                title="Ayarlar"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">Kullanıcı</p>
                  <p className="text-xs text-gray-600">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 focus:outline-none ${
                activeTab === tab.key
                  ? 'bg-white border-indigo-600 text-indigo-700 shadow'
                  : 'bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:text-indigo-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'tasks' && (
            <>
              <TaskForm />
              <TaskList />
            </>
          )}
          {activeTab === 'documents' && (
            <>
              <DocumentForm />
              <DocumentList />
            </>
          )}
          {activeTab === 'emails' && (
            <>
              <EmailForm />
              <EmailList />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 TaskFlow. Tüm hakları saklıdır.</p>
            <p className="text-sm mt-1">Supabase ile güçlendirilmiştir</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App