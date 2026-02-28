import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getAllCenters,
  updateCenterStatus,
  createAdminViaFunction,
} from '../services/firebaseService'
import PhotoModal from './PhotoModal'
import CancelModal from './CancelModal'

export default function AdminDashboard() {
  const { logout, isAdmin } = useAuth()
  const [centers, setCenters] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [photoModal, setPhotoModal] = useState({ show: false, src: null, title: '' })
  const [cancelTarget, setCancelTarget] = useState(null)
  const [createAdminEmail, setCreateAdminEmail] = useState('')
  const [createAdminPassword, setCreateAdminPassword] = useState('')
  const [createAdminLoading, setCreateAdminLoading] = useState(false)
  const [createAdminMessage, setCreateAdminMessage] = useState('')

  const loadCenters = async () => {
    setLoading(true)
    try {
      const data = await getAllCenters()
      setCenters(data)
      setFiltered(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCenters()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(centers)
      return
    }
    const s = search.toLowerCase()
    setFiltered(
      centers.filter(
        (r) =>
          (r.centerName || '').toLowerCase().includes(s) ||
          (r.district || '').toLowerCase().includes(s) ||
          (r.village || '').toLowerCase().includes(s) ||
          (r.registrationId || '').toLowerCase().includes(s)
      )
    )
  }, [search, centers])

  const handleApprove = async (id) => {
    if (!confirm('Approve this center registration?')) return
    try {
      await updateCenterStatus(id, 'Approved')
      await loadCenters()
      alert('✅ Center approved successfully!')
    } catch (err) {
      alert(err.message || 'Failed to approve')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Reject this center registration?')) return
    try {
      await updateCenterStatus(id, 'Rejected')
      await loadCenters()
      alert('❌ Center registration rejected')
    } catch (err) {
      alert(err.message || 'Failed to reject')
    }
  }

  const handleCancelConfirm = async (centerId, remark) => {
    try {
      await updateCenterStatus(centerId, 'Cancelled', {
        cancelRemark: remark,
        cancelDate: new Date().toLocaleDateString(),
      })
      await loadCenters()
      setCancelTarget(null)
      alert('✅ Registration cancelled successfully')
    } catch (err) {
      alert(err.message || 'Failed to cancel')
    }
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setCreateAdminMessage('')
    if (!createAdminEmail.trim() || !createAdminPassword) {
      setCreateAdminMessage('Email and password are required.')
      return
    }
    if (createAdminPassword.length < 6) {
      setCreateAdminMessage('Password must be at least 6 characters.')
      return
    }
    setCreateAdminLoading(true)
    try {
      await createAdminViaFunction(createAdminEmail.trim(), createAdminPassword)
      setCreateAdminMessage('✅ Admin created successfully. They can now log in with that email and password.')
      setCreateAdminEmail('')
      setCreateAdminPassword('')
    } catch (err) {
      setCreateAdminMessage(err.message || 'Failed to create admin. Make sure you have deployed the createAdmin Cloud Function.')
    } finally {
      setCreateAdminLoading(false)
    }
  }

  const byDistrict = {}
  filtered.forEach((reg) => {
    const d = reg.district || 'Unknown'
    if (!byDistrict[d]) byDistrict[d] = []
    byDistrict[d].push(reg)
  })
  const sortedDistricts = Object.keys(byDistrict).sort()

  const stats = {
    total: centers.length,
    pending: centers.filter((r) => r.status === 'Pending').length,
    approved: centers.filter((r) => r.status === 'Approved').length,
    rejected: centers.filter((r) => r.status === 'Rejected').length,
    cancelled: centers.filter((r) => r.status === 'Cancelled').length,
  }

  return (
    <div className="tab-content active">
      <div className="info-box">
        <p>
          Welcome Admin!{' '}
          <button type="button" className="btn btn-secondary" style={{ float: 'right', width: 'auto', padding: '5px 15px', fontSize: '0.8em' }} onClick={logout}>
            Logout
          </button>
        </p>
      </div>

      {/* Create Admin - only for admins */}
      {isAdmin && (
        <div className="section">
          <h2 className="section-title">Create New Admin</h2>
          <p style={{ fontSize: '0.9em', color: '#6b7280', marginBottom: '12px' }}>Add another admin with email and password. They can log in from the Admin tab.</p>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label>New Admin Email</label>
              <input type="email" value={createAdminEmail} onChange={(e) => setCreateAdminEmail(e.target.value)} placeholder="newadmin@example.com" required />
            </div>
            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <input type="password" value={createAdminPassword} onChange={(e) => setCreateAdminPassword(e.target.value)} minLength={6} required />
            </div>
            {createAdminMessage && <p style={{ color: createAdminMessage.startsWith('✅') ? '#059669' : '#dc2626', marginBottom: '10px', fontSize: '0.9em' }}>{createAdminMessage}</p>}
            <button type="submit" className="btn btn-primary" disabled={createAdminLoading}>{createAdminLoading ? 'Creating...' : 'Create Admin'}</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div className="stat-card" style={{ marginBottom: 0 }}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card" style={{ marginBottom: 0 }}>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card" style={{ marginBottom: 0 }}>
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card" style={{ marginBottom: 0 }}>
          <div className="stat-number">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card" style={{ marginBottom: 0 }}>
          <div className="stat-number">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">All Centers</h2>
        <div className="search-box">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, district, or ID..." />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No registrations yet</p>
        ) : (
          sortedDistricts.map((district) => (
            <div key={district} style={{ marginBottom: '25px' }}>
              <h3 style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: 'white', padding: '12px 15px', borderRadius: '10px', fontSize: '1.1em', marginBottom: '10px' }}>
                📍 {district} ({byDistrict[district].length})
              </h3>
              {byDistrict[district].map((reg) => (
                <div key={reg.id} className="center-card">
                  <div className="center-header">
                    <div className="center-name">{reg.centerName}</div>
                    <span className={`status-badge status-${(reg.status || '').toLowerCase()}`}>{reg.status}</span>
                  </div>
                  <div className="center-info"><strong>ID:</strong> {reg.registrationId}</div>
                  <div className="center-info"><strong>Village:</strong> {reg.village}</div>
                  <div className="center-info"><strong>PIN:</strong> {reg.pincode}</div>
                  <div className="center-info"><strong>In-charge:</strong> {reg.inchargeName}</div>
                  <div className="center-info"><strong>Mobile:</strong> {reg.inchargeMobile}</div>
                  <div className="center-info"><strong>Email:</strong> {reg.inchargeEmail}</div>
                  <div className="center-info"><strong>Players:</strong> Boys: {reg.playersBoys}, Girls: {reg.playersGirls}, Total: {reg.playersTotal}</div>
                  <div className="center-info"><strong>Courts:</strong> {reg.numCourts} | <strong>Season:</strong> {reg.bvlSeason}</div>
                  <div className="center-info"><strong>Funding:</strong> {reg.fundingSource}</div>
                  {(reg.inchargePhoto || reg.coachGroupPhoto || reg.courtPhoto) && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '0.85em', fontWeight: 600, color: '#3b82f6', marginBottom: '5px' }}>📸 Photos:</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {reg.inchargePhoto && (
                          <img src={reg.inchargePhoto} alt="In-charge" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', border: '2px solid #bfdbfe', cursor: 'pointer' }} onClick={() => setPhotoModal({ show: true, src: reg.inchargePhoto, title: 'In-charge Photo' })} title="In-charge" />
                        )}
                        {reg.coachGroupPhoto && (
                          <img src={reg.coachGroupPhoto} alt="Coach" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', border: '2px solid #bfdbfe', cursor: 'pointer' }} onClick={() => setPhotoModal({ show: true, src: reg.coachGroupPhoto, title: 'Coach & Players' })} title="Coach with Players" />
                        )}
                        {reg.courtPhoto && (
                          <img src={reg.courtPhoto} alt="Court" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '8px', border: '2px solid #bfdbfe', cursor: 'pointer' }} onClick={() => setPhotoModal({ show: true, src: reg.courtPhoto, title: 'Court Photo' })} title="Court with Team" />
                        )}
                      </div>
                    </div>
                  )}
                  {reg.cancelRemark && <div className="center-info" style={{ color: '#dc2626', marginTop: '8px' }}><strong>Cancellation Reason:</strong> {reg.cancelRemark}</div>}
                  {(reg.status === 'Pending' || reg.status === 'Approved') && (
                    <div className="action-buttons">
                      {reg.status === 'Pending' && (
                        <>
                          <button type="button" className="btn btn-success" onClick={() => handleApprove(reg.id)}>✓ Approve</button>
                          <button type="button" className="btn btn-danger" onClick={() => handleReject(reg.id)}>✗ Reject</button>
                        </>
                      )}
                      <button type="button" className="btn btn-secondary" style={{ background: '#6b7280' }} onClick={() => setCancelTarget(reg.id)}>🚫 Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {photoModal.show && <PhotoModal src={photoModal.src} title={photoModal.title} onClose={() => setPhotoModal({ show: false, src: null, title: '' })} />}
      {cancelTarget && <CancelModal onConfirm={(remark) => handleCancelConfirm(cancelTarget, remark)} onClose={() => setCancelTarget(null)} />}
    </div>
  )
}
