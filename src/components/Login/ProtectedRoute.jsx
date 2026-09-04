import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (userProfile?.status === 'pending') {
    return (
      <div className="login-page">
        <div className="login-container" style={{ textAlign: 'center' }}>
          <div className="login-logo">⏳</div>
          <h2>Cuenta Pendiente</h2>
          <p className="text-muted">
            Tu cuenta está pendiente de aprobación. Contacta al administrador para activarla.
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute