import React from 'react'

export default function PhotoModal({ src, title, onClose }) {
  if (!src) return null
  return (
    <div className="modal show" style={{ display: 'block' }} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '90%', maxHeight: '90vh', padding: '15px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: '#1e40af', marginBottom: '15px', textAlign: 'center' }}>{title}</h3>
        <img src={src} alt={title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '10px' }} />
        <button type="button" className="btn btn-primary" onClick={onClose} style={{ marginTop: '15px' }}>Close</button>
      </div>
    </div>
  )
}
