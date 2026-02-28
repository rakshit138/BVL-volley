import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      try {
        if (firebaseUser) {
          const adminRef = doc(db, 'admins', firebaseUser.uid)
          const snap = await getDoc(adminRef)
          setIsAdmin(!!snap.exists())
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error('Admin check failed:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => firebaseSignOut(auth)

  const createAdmin = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  /** Re-check if current user is in admins collection (call after adding yourself in Firestore). */
  const refetchAdminStatus = async () => {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return false
    try {
      const adminRef = doc(db, 'admins', firebaseUser.uid)
      const snap = await getDoc(adminRef)
      const ok = !!snap.exists()
      setIsAdmin(ok)
      return ok
    } catch (err) {
      console.error('Admin check failed:', err)
      setIsAdmin(false)
      throw err
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    createAdmin,
    refetchAdminStatus,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
