import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user, isAdmin, logout, refetchAdminStatus } = useAuth()
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // Success: onAuthStateChanged will run and update isAdmin; App will show dashboard if admin
    } catch (err) {
      const message = err.message || 'Invalid email or password.'
      setError(message)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAgain = async () => {
    setCheckError('')
    setChecking(true)
    try {
      await refetchAdminStatus()
    } catch (err) {
      setCheckError(err.message || 'Could not check admin status. Deploy Firestore rules so you can read your admins doc.')
    } finally {
      setChecking(false)
    }
  }

  // Logged in but not in admins collection – show message, Check again, and logout
  if (user && !isAdmin) {
    return (
      <div className="section">
        <h2 className="section-title">Admin Login</h2>
        <div role="alert" style={{ background: '#fef3c7', color: '#92400e', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <p style={{ marginBottom: '8px' }}><strong>You are logged in, but this account is not an admin.</strong></p>
          <p style={{ fontSize: '0.9em', marginBottom: '8px' }}>Add your User UID to the <strong>admins</strong> collection in Firestore (document ID = your UID, field <code>role</code> = <code>admin</code>). Then click <strong>Check again</strong> below.</p>
          <p style={{ fontSize: '0.85em' }}>Your UID: <code style={{ wordBreak: 'break-all' }}>{user.uid}</code></p>
        </div>
        {checkError && (
          <div role="alert" style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9em' }}>
            {checkError}
            <p style={{ marginTop: '8px', fontSize: '0.85em' }}>Fix: In Firebase Console go to Firestore → Rules. Deploy rules that allow: <code>match /admins/&#123;adminId&#125; &#123; allow read: if request.auth.uid == adminId; &#125;</code></p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary" onClick={handleCheckAgain} disabled={checking}>
            {checking ? 'Checking...' : 'Check again'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => logout()}>Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <h2 className="section-title">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div role="alert" style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.9em' }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
