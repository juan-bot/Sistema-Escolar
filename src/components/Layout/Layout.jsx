import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { BsList, BsBell } from 'react-icons/bs'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
