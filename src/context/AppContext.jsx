import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sampleData } from '../data/sampleData'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [universities, setUniversities] = useState(() => {
    const saved = localStorage.getItem('cr_universities')
    return saved ? JSON.parse(saved) : sampleData.universities
  })

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('cr_classes')
    return saved ? JSON.parse(saved) : sampleData.classes
  })

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('cr_students')
    return saved ? JSON.parse(saved) : sampleData.students
  })

  const [rubrics, setRubrics] = useState(() => {
    const saved = localStorage.getItem('cr_rubrics')
    return saved ? JSON.parse(saved) : sampleData.rubrics
  })

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem('cr_grades')
    return saved ? JSON.parse(saved) : sampleData.grades
  })

  useEffect(() => { localStorage.setItem('cr_universities', JSON.stringify(universities)) }, [universities])
  useEffect(() => { localStorage.setItem('cr_classes', JSON.stringify(classes)) }, [classes])
  useEffect(() => { localStorage.setItem('cr_students', JSON.stringify(students)) }, [students])
  useEffect(() => { localStorage.setItem('cr_rubrics', JSON.stringify(rubrics)) }, [rubrics])
  useEffect(() => { localStorage.setItem('cr_grades', JSON.stringify(grades)) }, [grades])

  // University CRUD
  const addUniversity = (university) => {
    setUniversities(prev => [...prev, { ...university, id: uuidv4(), createdAt: new Date().toISOString() }])
  }

  const updateUniversity = (id, data) => {
    setUniversities(prev => prev.map(u => u.id === id ? { ...u, ...data } : u))
  }

  const deleteUniversity = (id) => {
    const classIds = classes.filter(c => c.universityId === id).map(c => c.id)
    setUniversities(prev => prev.filter(u => u.id !== id))
    setClasses(prev => prev.filter(c => c.universityId !== id))
    setStudents(prev => prev.filter(s => !classIds.includes(s.classId)))
    setRubrics(prev => prev.filter(r => !classIds.includes(r.classId)))
    setGrades(prev => prev.filter(g => {
      const studentIds = students.filter(s => classIds.includes(s.classId)).map(s => s.id)
      return !studentIds.includes(g.studentId)
    }))
  }

  // Class CRUD
  const addClass = (classData) => {
    setClasses(prev => [...prev, { ...classData, id: uuidv4(), createdAt: new Date().toISOString() }])
  }

  const updateClass = (id, data) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  const deleteClass = (id) => {
    const studentIds = students.filter(s => s.classId === id).map(s => s.id)
    setClasses(prev => prev.filter(c => c.id !== id))
    setStudents(prev => prev.filter(s => s.classId !== id))
    setRubrics(prev => prev.filter(r => r.classId !== id))
    setGrades(prev => prev.filter(g => !studentIds.includes(g.studentId)))
  }

  // Student CRUD
  const addStudent = (student) => {
    setStudents(prev => [...prev, { ...student, id: uuidv4(), createdAt: new Date().toISOString() }])
  }

  const updateStudent = (id, data) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id))
    setGrades(prev => prev.filter(g => g.studentId !== id))
  }

  // Rubric CRUD
  const addRubric = (rubric) => {
    setRubrics(prev => [...prev, { ...rubric, id: uuidv4(), createdAt: new Date().toISOString() }])
  }

  const updateRubric = (id, data) => {
    setRubrics(prev => prev.map(r => r.id === id ? { ...r, ...data } : r))
  }

  const deleteRubric = (id) => {
    setRubrics(prev => prev.filter(r => r.id !== id))
    setGrades(prev => prev.filter(g => g.rubricId !== id))
  }

  // Grade CRUD
  const addGrade = (grade) => {
    setGrades(prev => [...prev, { ...grade, id: uuidv4(), createdAt: new Date().toISOString() }])
  }

  const updateGrade = (id, data) => {
    setGrades(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }

  // Helpers
  const getClassesByUniversity = (universityId) => classes.filter(c => c.universityId === universityId)
  const getStudentsByClass = (classId) => students.filter(s => s.classId === classId)
  const getRubricsByClass = (classId) => rubrics.filter(r => r.classId === classId)
  const getUniversityById = (id) => universities.find(u => u.id === id)
  const getClassById = (id) => classes.find(c => c.id === id)

  const value = {
    universities, classes, students, rubrics, grades,
    addUniversity, updateUniversity, deleteUniversity,
    addClass, updateClass, deleteClass,
    addStudent, updateStudent, deleteStudent,
    addRubric, updateRubric, deleteRubric,
    addGrade, updateGrade,
    getClassesByUniversity, getStudentsByClass, getRubricsByClass,
    getUniversityById, getClassById
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
