import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  BsSpeedometer2,
  BsBuildings,
  BsBook,
  BsPeople,
  BsClipboardCheck,
  BsBarChartLine
} from 'react-icons/bs'

const navItems = [
  { path: '/', icon: BsSpeedometer2, label: 'Dashboard' },
  { path: '/universidades', icon: BsBuildings, label: 'Universidades' },
  { path: '/clases', icon: BsBook, label: 'Clases' },
  { path: '/alumnos', icon: BsPeople, label: 'Alumnos' },
  { path: '/rubricas', icon: BsClipboardCheck, label: 'Rúbricas' },
  { path: '/calificaciones', icon: BsBarChartLine, label: 'Calificaciones' }
]

const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">📐</div>
          <div className="brand-text">
            <h5 className="mb-0">ClassRoom</h5>
            <small>Gestión de Clases</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
              onClick={() => window.innerWidth < 992 && onToggle()}
            >
              <item.icon className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">P</div>
            <div className="user-info">
              <span className="user-name">Paola</span>
              <span className="user-role">Profesora</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
