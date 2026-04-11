import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  subscribeCollection,
  addDocument,
  updateDocument,
  deleteDocument,
  batchDeleteByField,
  batchDeleteDocs
} from '../services/firestoreService'

const AppContext = createContext()

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [universities, setUniversities] = useState([])
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [rubrics, setRubrics] = useState([])
  const [grades, setGrades] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listeners
  useEffect(() => {
    let loaded = 0
    const total = 6
    const checkLoaded = () => {
      loaded++
      if (loaded >= total) setLoading(false)
    }

    const unsubs = [
      subscribeCollection('universities', (data) => { setUniversities(data); checkLoaded() }),
      subscribeCollection('classes', (data) => { setClasses(data); checkLoaded() }),
      subscribeCollection('students', (data) => { setStudents(data); checkLoaded() }),
      subscribeCollection('rubrics', (data) => { setRubrics(data); checkLoaded() }),
      subscribeCollection('grades', (data) => { setGrades(data); checkLoaded() }),
      subscribeCollection('attendance', (data) => { setAttendance(data); checkLoaded() }),
    ]

    return () => unsubs.forEach(unsub => unsub())
  }, [])

  // University CRUD
  const addUniversity = async (university) => {
    await addDocument('universities', university)
  }

  const updateUniversity = async (id, data) => {
    await updateDocument('universities', id, data)
  }

  const deleteUniversity = async (id) => {
    const classIds = classes.filter(c => c.universityId === id).map(c => c.id)
    const studentIds = students.filter(s => classIds.includes(s.classId)).map(s => s.id)

    // Cascade delete
    if (studentIds.length) {
      const gradeIds = grades.filter(g => studentIds.includes(g.studentId)).map(g => g.id)
      await batchDeleteDocs('grades', gradeIds)
    }
    await batchDeleteDocs('students', students.filter(s => classIds.includes(s.classId)).map(s => s.id))
    await batchDeleteDocs('rubrics', rubrics.filter(r => classIds.includes(r.classId)).map(r => r.id))
    await batchDeleteDocs('classes', classIds)
    await deleteDocument('universities', id)
  }

  // Class CRUD
  const addClass = async (classData) => {
    await addDocument('classes', classData)
  }

  const updateClass = async (id, data) => {
    await updateDocument('classes', id, data)
  }

  const deleteClass = async (id) => {
    const studentIds = students.filter(s => s.classId === id).map(s => s.id)
    const gradeIds = grades.filter(g => studentIds.includes(g.studentId)).map(g => g.id)

    await batchDeleteDocs('grades', gradeIds)
    await batchDeleteDocs('students', studentIds)
    await batchDeleteDocs('rubrics', rubrics.filter(r => r.classId === id).map(r => r.id))
    await deleteDocument('classes', id)
  }

  // Student CRUD
  const addStudent = async (student) => {
    await addDocument('students', student)
  }

  const updateStudent = async (id, data) => {
    await updateDocument('students', id, data)
  }

  const deleteStudent = async (id) => {
    const gradeIds = grades.filter(g => g.studentId === id).map(g => g.id)
    await batchDeleteDocs('grades', gradeIds)
    await deleteDocument('students', id)
  }

  // Rubric CRUD
  const addRubric = async (rubric) => {
    await addDocument('rubrics', rubric)
  }

  const updateRubric = async (id, data) => {
    await updateDocument('rubrics', id, data)
  }

  const deleteRubric = async (id) => {
    const gradeIds = grades.filter(g => g.rubricId === id).map(g => g.id)
    await batchDeleteDocs('grades', gradeIds)
    await deleteDocument('rubrics', id)
  }

  // Grade CRUD
  const addGrade = async (grade) => {
    await addDocument('grades', grade)
  }

  const updateGrade = async (id, data) => {
    await updateDocument('grades', id, data)
  }

  // Attendance CRUD
  const addAttendance = async (session) => {
    await addDocument('attendance', session)
  }

  const updateAttendance = async (id, data) => {
    await updateDocument('attendance', id, data)
  }

  const deleteAttendance = async (id) => {
    await deleteDocument('attendance', id)
  }

  // Helpers
  const getClassesByUniversity = (universityId) => classes.filter(c => c.universityId === universityId)
  const getStudentsByClass = (classId) => students.filter(s => s.classId === classId)
  const getRubricsByClass = (classId) => rubrics.filter(r => r.classId === classId)
  const getUniversityById = (id) => universities.find(u => u.id === id)
  const getClassById = (id) => classes.find(c => c.id === id)

  const value = {
    universities, classes, students, rubrics, grades, attendance, loading,
    addUniversity, updateUniversity, deleteUniversity,
    addClass, updateClass, deleteClass,
    addStudent, updateStudent, deleteStudent,
    addRubric, updateRubric, deleteRubric,
    addGrade, updateGrade,
    addAttendance, updateAttendance, deleteAttendance,
    getClassesByUniversity, getStudentsByClass, getRubricsByClass,
    getUniversityById, getClassById
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
