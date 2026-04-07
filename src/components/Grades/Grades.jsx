import React, { useState, useEffect, useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { BsSave, BsCheckCircle, BsDownload } from 'react-icons/bs'
import * as XLSX from 'xlsx'

const Grades = () => {
  const { universities, classes, students, rubrics, grades, addGrade, updateGrade } = useApp()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedRubric, setSelectedRubric] = useState('')
  const [localGrades, setLocalGrades] = useState({})
  const [saved, setSaved] = useState(false)

  const classObj = useMemo(() => classes.find(c => c.id === selectedClass), [classes, selectedClass])
  const rubricObj = useMemo(() => rubrics.find(r => r.id === selectedRubric), [rubrics, selectedRubric])
  const classStudents = useMemo(() => students.filter(s => s.classId === selectedClass), [students, selectedClass])
  const classRubrics = useMemo(() => rubrics.filter(r => r.classId === selectedClass), [rubrics, selectedClass])
  const uni = useMemo(() => classObj ? universities.find(u => u.id === classObj.universityId) : null, [universities, classObj])

  useEffect(() => {
    if (!selectedRubric || !rubricObj || classStudents.length === 0) return
    const initial = {}
    classStudents.forEach(student => {
      const existingGrade = grades.find(
        g => g.studentId === student.id && g.rubricId === selectedRubric
      )
      initial[student.id] = {}
      rubricObj.criteria.forEach(criterion => {
        initial[student.id][criterion.id] = existingGrade?.scores?.[criterion.id] ?? ''
      })
    })
    setLocalGrades(initial)
  }, [selectedRubric, classStudents, grades, rubricObj])

  const handleScoreChange = (studentId, criterionId, value) => {
    const num = value === '' ? '' : Math.min(Math.max(0, Number(value)), 10)
    setLocalGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [criterionId]: num }
    }))
    setSaved(false)
  }

  // Calculate a student's grade for a referenced rubric (parcial)
  const calculateRubricRefGrade = (studentId, rubricRefId) => {
    const refRubric = rubrics.find(r => r.id === rubricRefId)
    if (!refRubric) return 0
    const studentGrade = grades.find(g => g.studentId === studentId && g.rubricId === rubricRefId)
    if (!studentGrade?.scores) return 0
    let total = 0
    refRubric.criteria.forEach(criterion => {
      const score = Number(studentGrade.scores[criterion.id]) || 0
      const percentage = score / 10
      total += percentage * criterion.weight
    })
    return Math.round(total / 10 * 100) / 100
  }

  const calculateFinalGrade = (studentId) => {
    if (!rubricObj || !localGrades[studentId]) return 0
    let total = 0
    rubricObj.criteria.forEach(criterion => {
      let score
      if (criterion.type === 'rubric_ref') {
        score = calculateRubricRefGrade(studentId, criterion.rubricRefId)
      } else {
        score = Number(localGrades[studentId]?.[criterion.id]) || 0
      }
      const percentage = score / 10
      total += percentage * criterion.weight
    })
    return Math.round(total / 10 * 100) / 100
  }

  const getGradeColor = (grade) => {
    if (grade >= 9) return 'var(--success)'
    if (grade >= 8) return 'var(--info)'
    if (grade >= 7) return 'var(--warning)'
    return 'var(--danger)'
  }

  const handleSave = () => {
    classStudents.forEach(student => {
      const existingGrade = grades.find(
        g => g.studentId === student.id && g.rubricId === selectedRubric
      )
      const scores = {}
      rubricObj.criteria.forEach(criterion => {
        scores[criterion.id] = Number(localGrades[student.id]?.[criterion.id]) || 0
      })
      if (existingGrade) {
        updateGrade(existingGrade.id, { scores })
      } else {
        addGrade({ studentId: student.id, rubricId: selectedRubric, scores })
      }
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleExport = () => {
    const rows = classStudents.map(student => {
      const row = {
        'Alumno': student.name,
        'Matrícula': student.matricula || ''
      }
      rubricObj.criteria.forEach(criterion => {
        if (criterion.type === 'rubric_ref') {
          row[criterion.name] = calculateRubricRefGrade(student.id, criterion.rubricRefId)
        } else {
          row[criterion.name] = Number(localGrades[student.id]?.[criterion.id]) || 0
        }
      })
      row['Calificación Final'] = calculateFinalGrade(student.id)
      return row
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Calificaciones')
    const fileName = `${uni?.abbreviation || 'Universidad'} - ${classObj?.name || 'Clase'} - ${rubricObj.name}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2>Calificaciones</h2>
          <p>Califica a tus alumnos usando las rúbricas definidas</p>
        </div>
        {selectedRubric && classStudents.length > 0 && (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-custom" onClick={handleExport}>
              <BsDownload size={18} /> Exportar Excel
            </button>
            <button className="btn btn-primary-custom" onClick={handleSave}>
              {saved
                ? <><BsCheckCircle size={18} /> ¡Guardado!</>
                : <><BsSave size={18} /> Guardar Calificaciones</>
              }
            </button>
          </div>
        )}
      </div>

      <div className="filter-bar">
        <Form.Select
          value={selectedClass}
          onChange={e => { setSelectedClass(e.target.value); setSelectedRubric('') }}
          style={{ maxWidth: 300 }}
        >
          <option value="">Seleccionar clase...</option>
          {classes.map(cls => {
            const u = universities.find(u => u.id === cls.universityId)
            return (
              <option key={cls.id} value={cls.id}>
                {u?.icon} {cls.name} ({cls.code})
              </option>
            )
          })}
        </Form.Select>
        {selectedClass && (
          <Form.Select
            value={selectedRubric}
            onChange={e => setSelectedRubric(e.target.value)}
            style={{ maxWidth: 300 }}
          >
            <option value="">Seleccionar rúbrica...</option>
            {classRubrics.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Form.Select>
        )}
      </div>

      {!selectedClass ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h5>Selecciona una clase</h5>
          <p>Elige una clase y una rúbrica para comenzar a calificar</p>
        </div>
      ) : !selectedRubric ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h5>Selecciona una rúbrica</h5>
          <p>
            {classRubrics.length === 0
              ? 'Esta clase no tiene rúbricas. Crea una primero en la sección de Rúbricas.'
              : 'Elige una rúbrica para calificar a los alumnos.'
            }
          </p>
        </div>
      ) : classStudents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h5>No hay alumnos en esta clase</h5>
          <p>Agrega alumnos a esta clase para poder calificarlos</p>
        </div>
      ) : (
        <div className="custom-card">
          <div className="card-header-custom">
            <div>
              <h5 style={{ marginBottom: 4 }}>{rubricObj.name}</h5>
              <div className="d-flex gap-2 flex-wrap">
                {uni && (
                  <span
                    className="badge-custom"
                    style={{
                      background: (uni.color || '#E91E86') + '15',
                      color: uni.color || '#E91E86'
                    }}
                  >
                    {uni.icon} {uni.abbreviation}
                  </span>
                )}
                <span className="badge-custom bg-primary-soft">{classObj?.name}</span>
              </div>
            </div>
          </div>
          <div className="card-body-custom p-0" style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 200, position: 'sticky', left: 0, background: 'var(--bg-main)', zIndex: 1 }}>
                    Alumno
                  </th>
                  {rubricObj.criteria.map(c => (
                    <th key={c.id} style={{ textAlign: 'center', minWidth: 120 }}>
                      <div>{c.name}</div>
                      <small style={{ fontWeight: 400, textTransform: 'none' }}>
                        ({c.weight}%){c.type === 'rubric_ref' ? ' 📋' : ''}
                      </small>
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', minWidth: 100 }}>Final</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map(student => {
                  const finalGrade = calculateFinalGrade(student.id)
                  return (
                    <tr key={student.id}>
                      <td style={{ position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                        <strong style={{ fontSize: 14 }}>{student.name}</strong>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {student.matricula}
                        </div>
                      </td>
                      {rubricObj.criteria.map(criterion => (
                        <td key={criterion.id} style={{ textAlign: 'center' }}>
                          {criterion.type === 'rubric_ref' ? (
                            <span style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: getGradeColor(calculateRubricRefGrade(student.id, criterion.rubricRefId)),
                              opacity: 0.9
                            }}>
                              {calculateRubricRefGrade(student.id, criterion.rubricRefId).toFixed(1)}
                            </span>
                          ) : (
                            <input
                              type="number"
                              className="grade-input"
                              min="0"
                              max={10}
                              value={localGrades[student.id]?.[criterion.id] ?? ''}
                              onChange={e => handleScoreChange(student.id, criterion.id, e.target.value)}
                              placeholder="—"
                            />
                          )}
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: getGradeColor(finalGrade)
                        }}>
                          {finalGrade.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Grades
