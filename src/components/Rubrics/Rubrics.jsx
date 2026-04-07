import React, { useState } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { BsPlus, BsPencil, BsTrash, BsTrophy } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'

const CRITERION_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6']

const Rubrics = () => {
  const { universities, classes, rubrics, addRubric, updateRubric, deleteRubric } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingRubric, setEditingRubric] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [filterClass, setFilterClass] = useState('all')
  const [form, setForm] = useState({
    classId: '',
    name: '',
    isFinal: false,
    criteria: [{ id: uuidv4(), name: '', description: '', maxScore: 10, weight: 100, type: 'custom' }]
  })

  const filteredRubrics = filterClass === 'all'
    ? rubrics
    : rubrics.filter(r => r.classId === filterClass)

  // Get non-final rubrics for the selected class (to reference in final rubric)
  const availableParciales = rubrics.filter(r => r.classId === form.classId && !r.isFinal && r.id !== editingRubric?.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingRubric) {
      updateRubric(editingRubric.id, form)
    } else {
      addRubric(form)
    }
    handleCloseModal()
  }

  const handleEdit = (rubric) => {
    setEditingRubric(rubric)
    setForm({
      classId: rubric.classId,
      name: rubric.name,
      isFinal: rubric.isFinal || false,
      criteria: rubric.criteria.map(c => ({ ...c }))
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRubric(null)
    setForm({
      classId: '',
      name: '',
      isFinal: false,
      criteria: [{ id: uuidv4(), name: '', description: '', maxScore: 10, weight: 100, type: 'custom' }]
    })
  }

  const addCriterion = () => {
    setForm({
      ...form,
      criteria: [...form.criteria, { id: uuidv4(), name: '', description: '', maxScore: 10, weight: 0, type: 'custom' }]
    })
  }

  const addRubricReference = (rubricId) => {
    const ref = rubrics.find(r => r.id === rubricId)
    if (!ref) return
    setForm({
      ...form,
      criteria: [...form.criteria, {
        id: uuidv4(),
        name: ref.name,
        description: `Promedio de ${ref.name}`,
        maxScore: 10,
        weight: 0,
        type: 'rubric_ref',
        rubricRefId: rubricId
      }]
    })
  }

  const removeCriterion = (id) => {
    if (form.criteria.length > 1) {
      setForm({ ...form, criteria: form.criteria.filter(c => c.id !== id) })
    }
  }

  const updateCriterion = (id, field, value) => {
    setForm({
      ...form,
      criteria: form.criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
    })
  }

  const totalWeight = form.criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0)

  // Rubric IDs already referenced in current final rubric
  const referencedRubricIds = form.criteria.filter(c => c.type === 'rubric_ref').map(c => c.rubricRefId)
  const unreferencedParciales = availableParciales.filter(r => !referencedRubricIds.includes(r.id))

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Rúbricas</h2>
          <p>Define los criterios de evaluación para tus clases</p>
        </div>
        <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
          <BsPlus size={20} /> Crear Rúbrica
        </button>
      </div>

      <div className="filter-bar">
        <Form.Select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          style={{ maxWidth: 300 }}
        >
          <option value="all">Todas las clases</option>
          {classes.map(cls => {
            const uni = universities.find(u => u.id === cls.universityId)
            return (
              <option key={cls.id} value={cls.id}>
                {uni?.icon} {cls.name} ({cls.code})
              </option>
            )
          })}
        </Form.Select>
      </div>

      {filteredRubrics.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h5>No hay rúbricas creadas</h5>
          <p>Crea rúbricas con criterios de evaluación para calificar a tus alumnos</p>
          <button className="btn btn-primary-custom" onClick={() => setShowModal(true)}>
            <BsPlus size={20} /> Crear Rúbrica
          </button>
        </div>
      ) : (
        <Row className="g-3">
          {filteredRubrics.map((rubric, i) => {
            const cls = classes.find(c => c.id === rubric.classId)
            const uni = cls ? universities.find(u => u.id === cls.universityId) : null
            const total = rubric.criteria.reduce((s, c) => s + (c.weight || 0), 0)
            return (
              <Col key={rubric.id} lg={6}>
                <div className={`rubric-card fade-in fade-in-delay-${(i % 4) + 1}`}>
                  <div className="rubric-header">
                    <div>
                      <div className="d-flex align-items-center gap-2" style={{ marginBottom: 4 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                          {rubric.name}
                        </h5>
                        {rubric.isFinal && (
                          <span className="badge-custom" style={{ background: '#F59E0B20', color: '#F59E0B', fontSize: 11 }}>
                            <BsTrophy size={12} /> Final
                          </span>
                        )}
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        {uni && (
                          <span
                            className="badge-custom"
                            style={{
                              background: (uni.color || '#6366F1') + '15',
                              color: uni.color || '#6366F1'
                            }}
                          >
                            {uni.icon} {uni.abbreviation}
                          </span>
                        )}
                        <span className="badge-custom bg-primary-soft">{cls?.name}</span>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn-sm-icon" onClick={() => handleEdit(rubric)}>
                        <BsPencil size={14} />
                      </button>
                      <button
                        className="btn-sm-icon danger"
                        onClick={() => setShowDeleteConfirm(rubric)}
                      >
                        <BsTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="rubric-criteria">
                    {rubric.criteria.map((criterion, ci) => {
                      const color = CRITERION_COLORS[ci % CRITERION_COLORS.length]
                      return (
                        <div key={criterion.id} className="criterion-item">
                          <div
                            className="criterion-weight"
                            style={{ background: color + '15', color }}
                          >
                            {criterion.weight}%
                          </div>
                          <div className="criterion-info">
                            <div className="d-flex align-items-center gap-2">
                              <h6>{criterion.name}</h6>
                              {criterion.type === 'rubric_ref' && (
                                <span style={{ fontSize: 10, background: '#6366F115', color: '#6366F1', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
                                  Parcial
                                </span>
                              )}
                            </div>
                            <p>{criterion.description}</p>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Máx.</div>
                            <strong>10</strong>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{
                    padding: '12px 24px',
                    background: 'var(--bg-main)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {rubric.criteria.length} criterio{rubric.criteria.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{
                      fontWeight: 600,
                      color: total === 100 ? 'var(--success)' : 'var(--danger)'
                    }}>
                      Total: {total}%
                    </span>
                  </div>
                </div>
              </Col>
            )
          })}
        </Row>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingRubric ? 'Editar Rúbrica' : 'Crear Rúbrica'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Clase</Form.Label>
                  <Form.Select
                    value={form.classId}
                    onChange={e => setForm({ ...form, classId: e.target.value, criteria: [{ id: uuidv4(), name: '', description: '', maxScore: 10, weight: 100, type: 'custom' }] })}
                    required
                  >
                    <option value="">Seleccionar clase...</option>
                    {classes.map(cls => {
                      const uni = universities.find(u => u.id === cls.universityId)
                      return (
                        <option key={cls.id} value={cls.id}>
                          {uni?.icon} {cls.name} - {uni?.abbreviation}
                        </option>
                      )
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Nombre de la Rúbrica</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Evaluación Parcial 1"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <div
                onClick={() => setForm({ ...form, isFinal: !form.isFinal })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: form.isFinal ? '2px solid #F59E0B' : '2px solid var(--border)',
                  background: form.isFinal ? '#F59E0B10' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: 20 }}>{form.isFinal ? '🏆' : '○'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Rúbrica Final</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Combina parciales y otros criterios para la calificación final
                  </div>
                </div>
              </div>
            </Form.Group>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0" style={{ fontSize: 14, fontWeight: 600 }}>
                Criterios de Evaluación
              </h6>
              <div className="d-flex align-items-center gap-3">
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: totalWeight === 100 ? 'var(--success)' : 'var(--danger)'
                }}>
                  Total: {totalWeight}%
                </span>
                <button
                  type="button"
                  className="btn btn-outline-custom"
                  onClick={addCriterion}
                  style={{ padding: '6px 12px', fontSize: 13 }}
                >
                  <BsPlus size={16} /> Agregar
                </button>
              </div>
            </div>

            {form.isFinal && form.classId && unreferencedParciales.length > 0 && (
              <div style={{
                background: '#F59E0B10',
                border: '1px dashed #F59E0B',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
                marginBottom: 12
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#F59E0B' }}>
                  <BsTrophy size={14} /> Agregar parcial como criterio:
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {unreferencedParciales.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      className="btn btn-outline-custom"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={() => addRubricReference(r.id)}
                    >
                      <BsPlus size={14} /> {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {form.criteria.map((criterion) => (
              <div
                key={criterion.id}
                style={{
                  background: criterion.type === 'rubric_ref' ? '#6366F108' : 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 16,
                  marginBottom: 12,
                  border: criterion.type === 'rubric_ref' ? '1px solid #6366F130' : '1px solid var(--border)'
                }}
              >
                <div className="d-flex gap-2 mb-2">
                  {criterion.type === 'rubric_ref' ? (
                    <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, background: '#6366F115', color: '#6366F1', padding: '2px 6px', borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>
                        Parcial
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{criterion.name}</span>
                    </div>
                  ) : (
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Nombre del criterio"
                      value={criterion.name}
                      onChange={e => updateCriterion(criterion.id, 'name', e.target.value)}
                      required
                      style={{ fontWeight: 600 }}
                    />
                  )}
                  <Form.Control
                    size="sm"
                    type="number"
                    placeholder="Peso %"
                    min="0"
                    max="100"
                    value={criterion.weight}
                    onChange={e => updateCriterion(criterion.id, 'weight', Number(e.target.value))}
                    style={{ width: 90 }}
                    required
                  />
                  {form.criteria.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeCriterion(criterion.id)}
                      style={{ flexShrink: 0 }}
                    >
                      <BsTrash size={14} />
                    </Button>
                  )}
                </div>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Descripción del criterio (opcional)"
                  value={criterion.description}
                  onChange={e => updateCriterion(criterion.id, 'description', e.target.value)}
                />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
            <button
              type="submit"
              className="btn btn-primary-custom"
              disabled={totalWeight !== 100}
            >
              {totalWeight !== 100
                ? `Peso total: ${totalWeight}% (debe ser 100%)`
                : (editingRubric ? 'Guardar Cambios' : 'Crear Rúbrica')
              }
            </button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={!!showDeleteConfirm} onHide={() => setShowDeleteConfirm(null)} centered size="sm">
        <Modal.Body className="text-center py-4">
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h5>¿Eliminar rúbrica?</h5>
          <p className="text-muted" style={{ fontSize: 14 }}>
            Se eliminará <strong>{showDeleteConfirm?.name}</strong> y las calificaciones asociadas.
          </p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => { deleteRubric(showDeleteConfirm.id); setShowDeleteConfirm(null) }}
            >
              Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Rubrics
