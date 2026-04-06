import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { sampleData } from '../data/sampleData'

/**
 * Sube los datos de ejemplo a Firestore.
 * Solo ejecutar una vez para poblar la base de datos.
 * Se puede invocar desde la consola del navegador o desde un botón.
 */
export const seedFirestore = async () => {
  // Check if data already exists
  const uniSnap = await getDocs(collection(db, 'universities'))
  if (!uniSnap.empty) {
    console.log('⚠️ Firestore ya tiene datos. Seed cancelado.')
    return
  }

  console.log('🔄 Subiendo datos de ejemplo a Firestore...')

  // We need to map old IDs to new Firestore IDs
  const universityIdMap = {}
  const classIdMap = {}
  const studentIdMap = {}

  // 1. Universities
  for (const uni of sampleData.universities) {
    const { id, ...data } = uni
    const ref = await addDoc(collection(db, 'universities'), {
      ...data,
      createdAt: serverTimestamp()
    })
    universityIdMap[id] = ref.id
  }
  console.log(`✅ ${sampleData.universities.length} universidades creadas`)

  // 2. Classes (remap universityId)
  for (const cls of sampleData.classes) {
    const { id, universityId, ...data } = cls
    const ref = await addDoc(collection(db, 'classes'), {
      ...data,
      universityId: universityIdMap[universityId],
      createdAt: serverTimestamp()
    })
    classIdMap[id] = ref.id
  }
  console.log(`✅ ${sampleData.classes.length} clases creadas`)

  // 3. Students (remap classId)
  for (const stu of sampleData.students) {
    const { id, classId, ...data } = stu
    const ref = await addDoc(collection(db, 'students'), {
      ...data,
      classId: classIdMap[classId],
      createdAt: serverTimestamp()
    })
    studentIdMap[id] = ref.id
  }
  console.log(`✅ ${sampleData.students.length} alumnos creados`)

  // 4. Rubrics (remap classId)
  for (const rub of sampleData.rubrics) {
    const { id, classId, ...data } = rub
    await addDoc(collection(db, 'rubrics'), {
      ...data,
      classId: classIdMap[classId],
      createdAt: serverTimestamp()
    })
  }
  console.log(`✅ ${sampleData.rubrics.length} rúbricas creadas`)

  // 5. Grades (remap studentId, rubricId)
  for (const grade of sampleData.grades) {
    const { id, studentId, rubricId, ...data } = grade
    await addDoc(collection(db, 'grades'), {
      ...data,
      studentId: studentIdMap[studentId],
      rubricId: rubricId, // rubricId might not need remapping if empty
      createdAt: serverTimestamp()
    })
  }
  console.log(`✅ ${sampleData.grades.length} calificaciones creadas`)

  console.log('🎉 ¡Seed completado!')
}
