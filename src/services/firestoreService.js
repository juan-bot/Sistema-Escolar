import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// Collection references
const col = (name) => collection(db, name)

// ---------- Generic CRUD ----------

export const subscribeCollection = (collectionName, callback) => {
  return onSnapshot(query(col(collectionName)), (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(data)
  })
}

export const addDocument = async (collectionName, data) => {
  const { id, ...rest } = data  // remove any client-side id
  const docRef = await addDoc(col(collectionName), {
    ...rest,
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
