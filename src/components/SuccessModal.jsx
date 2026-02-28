import React from 'react'

export default function SuccessModal({ registrationId, onClose }) {
  return (
    <div className="modal show" style={{ display: 'block' }}>
      <div className="modal-content">
        <h2>✅ Registration Complete!</h2>
        <div className="registration-id">{registrationId}</div>
        <p style={{ fontSize: '0.9em', marginBottom: '15px' }}>
          Your registration has been submitted successfully. Please save your Registration ID for future reference.
        </p>
        <p style={{ fontSize: '0.85em', color: '#6b7280' }}><strong>Status:</strong> Pending Admin Approval</p>
        <button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
