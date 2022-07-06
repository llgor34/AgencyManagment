import { initializeApp, credential } from 'firebase-admin';
import 'firebase-admin/firestore';
import 'firebase-admin/auth';

const serviceAccount = require('./service-account-token.json');
export const app = initializeApp({
  credential: credential.cert(serviceAccount),
});

export const projectFirestore = app.firestore();
export const projectAuth = app.auth();
