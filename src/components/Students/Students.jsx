import React, { useState, useRef } from 'react'
import { Row, Col, Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { BsPlus, BsPencil, BsTrash, BsSearch, BsFileEarmarkSpreadsheet, BsUpload } from 'react-icons/bs'
import * as XLSX from 'xlsx'

const AVATAR_COLORS = [
  '#E91E86', '#F472B6', '#10B981', '#F59E0B', '#EC4899',
  '#BE185D', '#F9A8D4', '#14B8A6', '#F97316', '#06B6D4'
]

const Students = () => {
  const {
    universities, classes, students,
    addStudent, updateStudent, deleteStudent
  } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [filterUni, setFilterUni] = useState('all')
  const [filterClass, setFilterClass] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [form, setForm] = useState({ classId: '', name: '', email: '', matricula: '' })
  const [showImportModal, setShowImportModal] = useState(false)
  const [importClassId, setImportClassId] = useState('')
  const [importPreview, setImportPreview] = useState([])
  const [importError, setImportError] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  const availableClasses = filterUni === 'all'
    ? classes
    : classes.filter(c => c.universityId === filterUni)

  let filteredStudents = students
  if (filterClass !== 'all') {
    filteredStudents = filteredStudents.filter(s => s.classId === filterClass)
  } else if (filterUni !== 'all') {
    const uniClassIds = classes.filter(c => c.universityId === filterUni).map(c => c.id)
    filteredStudents = filteredStudents.filter(s => uniClassIds.includes(s.classId))
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredStudents = filteredStudents.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.matricula.toLowerCase().includes(term)
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingStudent) {
      updateStudent(editingStudent.id, form)
    } else {
      addStudent(form)
    }
    handleCloseModal()
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setForm({
      classId: student.classId,
      name: student.name,
      email: student.email,
      matricula: student.matricula
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingStudent(null)
    setForm({
      classId: filterClass !== 'all' ? filterClass : '',
      name: '', email: '', matricula: ''
    })
  }

  const handleOpenAdd = () => {
    setForm({
      classId: filterClass !== 'all' ? filterClass : '',
      name: '', email: '', matricula: ''
    })
    setShowModal(true)
  }

  const getAvatarColor = (name) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
  }

  const handleImportFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImportError('')
    setImportPreview([])

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const raw = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (raw.length === 0) {
          setImportError('El archivo está vacío.')
          return
        }

        // Normalize column names to lowercase for flexible matching
        const normalize = (s) => String(s).toLowerCase().trim()
        const originalKeys = Object.keys(raw[0])
        const keyMap = {}
        originalKeys.forEach(k => {
          const n = normalize(k)
          if (n.includes('matricula') || n.includes('matrícula')) keyMap[k] = 'matricula'
          else if (n === 'alumno' || n === 'alumnos') keyMap[k] = 'name'
        })

        const hasMatricula = Object.values(keyMap).includes('matricula')
        const hasName = Object.values(keyMap).includes('name')

        if (!hasMatricula && !hasName) {
          setImportError('No se encontraron columnas de "Matrícula" ni "Alumno". Asegúrate de que el Excel tenga esas columnas.')
          return
        }

        const rows = raw.map(row => {
          const mapped = { name: '', matricula: '', email: '' }
          for (const [origKey, field] of Object.entries(keyMap)) {
            mapped[field] = String(row[origKey] || '').trim()
          }
          return mapped
        }).filter(r => r.name || r.matricula)

        if (rows.length === 0) {
          setImportError('No se encontraron filas con datos.')
          return
        }

        setImportPreview(rows)
      } catch {
        setImportError('Error al leer el archivo. Asegúrate de que sea un archivo Excel válido (.xlsx, .xls).')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImportSubmit = async () => {
    if (!importClassId) {
      setImportError('Selecciona una clase.')
      return
    }
    if (importPreview.length === 0) {
      setImportError('No hay alumnos para importar.')
      return
    }
    setImporting(true)
    try {
      for (const row of importPreview) {
        await addStudent({
          classId: importClassId,
          name: row.name,
          email: row.email || '',
          matricula: row.matricula
        })
      }
      handleCloseImportModal()
    } catch {
      setImportError('Error al importar alumnos. Intenta de nuevo.')
    } finally {
      setImporting(false)
    }
  }

  const handleCloseImportModal = () => {
    setShowImportModal(false)
    setImportClassId('')
    setImportPreview([])
    setImportError('')
    setImporting(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Alumnos</h2>
          <p>Gestiona a tus alumnos por clase y universidad</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary-custom" onClick={() => setShowImportModal(true)} style={{ background: '#10B981', borderColor: '#10B981' }}>
            <BsFileEarmarkSpreadsheet size={18} /> Importar Excel
          </button>
          <button className="btn btn-primary-custom" onClick={handleOpenAdd}>
            <BsPlus size={20} /> Agregar Alumno
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <Form.Select
          value={filterUni}
          onChange={e => { setFilterUni(e.target.value); setFilterClass('all') }}
          style={{ maxWidth: 250 }}
        >
          <option value="all">Todas las universidades</option>
          {universities.map(uni => (
            <option key={uni.id} value={uni.id}>{uni.icon} {uni.name}</option>
          ))}
        </Form.Select>
        <Form.Select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          style={{ maxWidth: 250 }}
        >
          <option value="all">Todas las clases</option>
          {availableClasses.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>
          ))}
        </Form.Select>
        <div className="search-box" style={{ maxWidth: 250 }}>
          <BsSearch className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h5>No hay alumnos {searchTerm ? 'que coincidan' : 'registrados'}</h5>
          <p>
            {searchTerm
              ? 'Intenta con otro término de búsqueda'
              : 'Agrega alumnos a tus clases para comenzar'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary-custom" onClick={handleOpenAdd}>
              <BsPlus size={20} /> Agregar Alumno
            </button>
          )}
        </div>
      ) : (
        <div className="custom-card">
          <div className="card-body-custom p-0">
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Email</th>
                    <th>Matrícula</th>
                    <th>Clase</th>
                    <th>Universidad</th>
                    <th style={{ width: 100 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const cls = classes.find(c => c.id === student.classId)
                    const uni = cls ? universities.find(u => u.id === cls.universityId) : null
                    return (
                      <tr key={student.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="student-avatar"
                              style={{ background: getAvatarColor(student.name) }}
                            >
                              {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <strong style={{ fontSize: 14 }}>{student.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            {student.email}
                          </span>
                        </td>
                        <td>
                          <code style={{
                            background: 'var(--bg-main)',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 13
                          }}>
                            {student.matricula}
                          </code>
                        </td>
                        <td>
                          <span className="badge-custom bg-primary-soft">
                            {cls?.name || '—'}
                          </span>
                        </td>
                        <td>
                          {uni && (
                            <span
                              className="badge-custom"
                              style={{
                                background: uni.color + '15',
                                color: uni.color
                              }}
                            >
                              {uni.icon} {uni.abbreviation}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn-sm-icon"
                              onClick={() => handleEdit(student)}
                            >
                              <BsPencil size={14} />
                            </button>
                            <button
                              className="btn-sm-icon danger"
                              onClick={() => setShowDeleteConfirm(student)}
                            >
                              <BsTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingStudent ? 'Editar Alumno' : 'Agregar Alumno'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Clase</Form.Label>
              <Form.Select
                value={form.classId}
                onChange={e => setForm({ ...form, classId: e.target.value })}
                required
              >
                <option value="">Seleccionar clase...</option>
                {classes.map(cls => {
                  const uni = universities.find(u => u.id === cls.universityId)
                  return (
                    <option key={cls.id} value={cls.id}>
                      {uni?.icon} {cls.name} ({cls.code}) - {uni?.abbreviation}
                    </option>
                  )
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Ana García López"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>
            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="alumno@universidad.edu.mx"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Matrícula</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MAT2024001"
                    value={form.matricula}
                    onChange={e => setForm({ ...form, matricula: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <button type="submit" className="btn btn-primary-custom">
              {editingStudent ? 'Guardar Cambios' : 'Agregar'}
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Import Excel Modal */}
      <Modal show={showImportModal} onHide={handleCloseImportModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><BsFileEarmarkSpreadsheet className="me-2" />Importar Alumnos desde Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {importError && <Alert variant="danger" onClose={() => setImportError('')} dismissible>{importError}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Clase destino</Form.Label>
            <Form.Select
              value={importClassId}
              onChange={e => setImportClassId(e.target.value)}
              required
            >
              <option value="">Seleccionar clase...</option>
              {classes.map(cls => {
                const uni = universities.find(u => u.id === cls.universityId)
                return (
                  <option key={cls.id} value={cls.id}>
                    {uni?.icon} {cls.name} ({cls.code}) - {uni?.abbreviation}
                  </option>
                )
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Archivo Excel (.xlsx, .xls)</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleImportFile}
            />
            <Form.Text className="text-muted">
              El archivo debe tener columnas de "Matrícula" y "Alumnos" (o "Nombre").
            </Form.Text>
          </Form.Group>

          {importPreview.length > 0 && (
            <div>
              <h6 className="mb-2">Vista previa ({importPreview.length} alumnos)</h6>
              <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                <table className="custom-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{row.name || <span className="text-muted">—</span>}</td>
                        <td><code>{row.matricula || '—'}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImportModal} disabled={importing}>Cancelar</Button>
          <button
            className="btn btn-primary-custom"
            style={{ background: '#10B981', borderColor: '#10B981' }}
            onClick={handleImportSubmit}
            disabled={importing || importPreview.length === 0 || !importClassId}
          >
            {importing ? <><Spinner size="sm" className="me-2" />Importando...</> : <><BsUpload className="me-2" />Importar {importPreview.length} Alumnos</>}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={!!showDeleteConfirm} onHide={() => setShowDeleteConfirm(null)} centered size="sm">
        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h5>¿Eliminar alumno?</h5>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Se eliminará a <strong>{showDeleteConfirm?.name}</strong> y sus calificaciones.
          </p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => { deleteStudent(showDeleteConfirm.id); setShowDeleteConfirm(null) }}
            >
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Students
