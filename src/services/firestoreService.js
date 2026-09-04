import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
  getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

// Collection references
const col = (name) => collection(db, name)

// ---------- Generic CRUD ----------

export const subscribeCollection = (collectionName, userId, callback) => {
  const fetchData = async () => {
    try {
      await new Promise(r => setTimeout(r, 200))
      const q = userId ? query(col(collectionName), where('userId', '==', userId)) : query(col(collectionName))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      callback(data)
    } catch (err) {
      console.error(`Error cargando ${collectionName}:`, err)
    }
  }
  fetchData()
  return () => {}
}

export const subscribeAll = (collectionName, callback) => {
  const fetchData = async () => {
    try {
      await new Promise(r => setTimeout(r, 200))
      const snapshot = await getDocs(col(collectionName))
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      callback(data)
    } catch (err) {
      console.error(`Error cargando ${collectionName}:`, err)
    }
  }
  fetchData()
  return () => {}
}

export const addDocument = async (collectionName, data, userId) => {
  const { id, ...rest } = data
  const docRef = await addDoc(col(collectionName), {
    ...rest,
    userId,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const updateDocument = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, data)
}

export const deleteDocument = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
}

// ---------- Batch delete helpers ----------

export const batchDeleteByField = async (collectionName, fieldName, value, allDocs) => {
  const ids = allDocs.filter(d => d[fieldName] === value).map(d => d.id)
  await batchDeleteDocs(collectionName, ids)
}

export const batchDeleteDocs = async (collectionName, ids) => {
  if (ids.length === 0) return
  const batch = writeBatch(db)
  ids.forEach(id => batch.delete(doc(db, collectionName, id)))
  await batch.commit()
}
