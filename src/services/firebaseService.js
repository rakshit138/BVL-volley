import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, httpsCallable, functions } from '../firebase'
import { compressImageDataUrl } from '../utils/imageCompress'

const CENTERS_COLLECTION = 'centers'
const ADMINS_COLLECTION = 'admins'

function generateRegistrationId() {
  return 'BVL' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase()
}

export async function saveCenterRegistration(data) {
  const regId = generateRegistrationId()
  const docData = {
    ...data,
    registrationId: regId,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, CENTERS_COLLECTION), docData)
  return { registrationId: regId, id: docRef.id }
}

/**
 * Saves center registration to Firestore with photos as compressed base64 (no Storage needed).
 * Photos are compressed to fit within Firestore's 1MB document limit.
 */
export async function saveCenterRegistrationWithPhotos(formData, photoBlobs) {
  const regId = generateRegistrationId()
  const photos = {}

  if (photoBlobs.inchargePhoto) {
    try {
      photos.inchargePhoto = await compressImageDataUrl(photoBlobs.inchargePhoto)
    } catch (e) {
      console.warn('Incharge photo compress failed:', e)
    }
  }
  if (photoBlobs.courtPhoto) {
    try {
      photos.courtPhoto = await compressImageDataUrl(photoBlobs.courtPhoto)
    } catch (e) {
      console.warn('Court photo compress failed:', e)
    }
  }
  if (photoBlobs.coachGroupPhoto) {
    try {
      photos.coachGroupPhoto = await compressImageDataUrl(photoBlobs.coachGroupPhoto)
    } catch (e) {
      console.warn('Coach group photo compress failed:', e)
    }
  }

  const docData = {
    ...formData,
    ...photos,
    registrationId: regId,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, CENTERS_COLLECTION), docData)
  return { registrationId: regId, id: docRef.id }
}

export async function getAllCenters() {
  const q = query(
    collection(db, CENTERS_COLLECTION),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateCenterStatus(centerId, status, extra = {}) {
  const centerRef = doc(db, CENTERS_COLLECTION, centerId)
  await updateDoc(centerRef, { status, ...extra })
}

export async function addAdminUser(uid, email) {
  const adminRef = doc(db, ADMINS_COLLECTION, uid)
  await setDoc(adminRef, {
    email,
    role: 'admin',
    createdAt: new Date().toISOString(),
  })
}

/** Call Cloud Function to create a new admin (only works when called by an existing admin). Deploy functions/createAdmin first. */
export async function createAdminViaFunction(email, password) {
  const createAdmin = httpsCallable(functions, 'createAdmin')
  const result = await createAdmin({ email, password })
  return result.data
}
