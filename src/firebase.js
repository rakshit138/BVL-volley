import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey: 'AIzaSyBV2Ar_oXyt4eeN6h1JNHUYIexFtCH9ojY',
  authDomain: 'bvl-registration.firebaseapp.com',
  projectId: 'bvl-registration',
  storageBucket: 'bvl-registration.firebasestorage.app',
  messagingSenderId: '292864733268',
  appId: '1:292864733268:web:70d61a24e51c0cb3023dc1',
  measurementId: 'G-TG6LB1BQKY',
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)
export { httpsCallable }
export default app
