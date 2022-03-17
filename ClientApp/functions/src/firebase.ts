import * as firebaseAdmin from 'firebase-admin';

// initialize firebase
firebaseAdmin.initializeApp();

// initialize firebase services
export const projectFirestore = firebaseAdmin.firestore();
export const projectAuth = firebaseAdmin.auth();
