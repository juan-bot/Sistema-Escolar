import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { BsList, BsBell, BsSun, BsMoon } from 'react-icons/bs'
import { useApp } from '../../context/AppContext'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { loading, theme, toggleTheme } = useApp()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="main-content">
        <header className="top-bar">
          <button
            className="btn btn-link sidebar-toggle d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <BsList size={24} />
          </button>
          <div style={{ flex: 1 }} />
          <div className="top-bar-actions">
            <button
              className="btn btn-link notification-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme === 'light' ? <BsMoon size={20} /> : <BsSun size={20} />}
            </button>
            <button className="btn btn-link notification-btn">
              <BsBell size={20} />
            </button>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
