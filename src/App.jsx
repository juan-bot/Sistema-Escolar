import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import Universities from './components/Universities/Universities'
import Classes from './components/Classes/Classes'
import Students from './components/Students/Students'
import Rubrics from './components/Rubrics/Rubrics'
import Grades from './components/Grades/Grades'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/universidades" element={<Universities />} />
            <Route path="/clases" element={<Classes />} />
            <Route path="/alumnos" element={<Students />} />
            <Route path="/rubricas" element={<Rubrics />} />
            <Route path="/calificaciones" element={<Grades />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}

export default App
