import React, { useState } from 'react'

export default function CancelModal({ onConfirm, onClose }) {
  const [remark, setRemark] = useState('')
  const handleConfirm = async () => {
    if (!remark.trim()) {
      alert('Please provide a cancellation reason')
      return
    }
    if (confirm('Are you sure you want to cancel this registration?')) {
      await onConfirm(remark.trim())
      setRemark('')
      onClose()
    }
  }
  return (
    <div className="modal show" style={{ display: 'block' }}>
      <div className="modal-content">
        <h2>⚠️ Cancel Registration</h2>
        <p style={{ marginBottom: '15px', fontSize: '0.9em' }}>Please provide a reason for cancellation:</p>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          style={{ width: '100%', padding: '12px', border: '2px solid #bfdbfe', borderRadius: '8px', minHeight: '100px', fontSize: '1em', marginBottom: '15px' }}
          placeholder="Enter cancellation reason..."
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-danger" onClick={handleConfirm}>Confirm Cancel</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setRemark(''); onClose(); }}>Close</button>
        </div>
      </div>
    </div>
  )
}
