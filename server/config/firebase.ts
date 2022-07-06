import admin from 'firebase-admin';
import firebaseAccountCredentials from './service-account-token.json';
import 'firebase-admin/firestore';
import 'firebase-admin/auth';

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const projectFirestore = app.firestore();
export const projectAuth = app.auth();
