const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

/**
 * Only an existing admin can create a new admin.
 * Call with: { email: string, password: string }
 * The caller must be logged in and their UID must exist in Firestore admins/{uid}.
 */
exports.createAdmin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.')
  }
  const callerUid = context.auth.uid
  const adminDoc = await admin.firestore().collection('admins').doc(callerUid).get()
  if (!adminDoc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create new admins.')
  }

  const { email, password } = data
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Email and password are required.')
  }
  if (password.length < 6) {
    throw new functions.https.HttpsError('invalid-argument', 'Password must be at least 6 characters.')
  }

  let newUser
  try {
    newUser = await admin.auth().createUser({
      email: email.trim(),
      password,
      emailVerified: false,
    })
  } catch (err) {
    throw new functions.https.HttpsError('invalid-argument', err.message || 'Failed to create user.')
  }

  await admin.firestore().collection('admins').doc(newUser.uid).set({
    email: newUser.email,
    role: 'admin',
    createdAt: new Date().toISOString(),
    createdBy: callerUid,
  })

  return { success: true, uid: newUser.uid, email: newUser.email }
})
