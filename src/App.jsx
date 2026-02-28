import React, { useState } from 'react'
import Header from './components/Header'
import RegistrationForm from './components/RegistrationForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import SuccessModal from './components/SuccessModal'
import { useAuth } from './context/AuthContext'

function App() {
  const [activeTab, setActiveTab] = useState('registration')
  const [successRegId, setSuccessRegId] = useState(null)
  const { isAdmin, loading } = useAuth()

  return (
    <div className="container">
      <Header />
      {activeTab === 'registration' && (
        <RegistrationForm onSuccess={(regId) => setSuccessRegId(regId)} />
      )}
      {activeTab === 'admin' && (
        <>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
          ) : isAdmin ? (
            <AdminDashboard />
          ) : (
            <div style={{ padding: '15px' }}>
              <AdminLogin />
            </div>
          )}
        </>
      )}

      <div className="bottom-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <span className="nav-icon">📝</span>
          Register
        </button>
        <button
          type="button"
          className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <span className="nav-icon">⚙️</span>
          Admin
        </button>
      </div>

      {successRegId && (
        <SuccessModal
          registrationId={successRegId}
          onClose={() => {
            setSuccessRegId(null)
            window.scrollTo(0, 0)
          }}
        />
      )}
    </div>
  )
}

export default App
