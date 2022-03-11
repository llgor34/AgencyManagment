import { Injectable } from '@angular/core';
import {
  Firestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  collectionData,
  query,
  collection,
  addDoc,
  Timestamp,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async setDocument(col: string, docName: string, data: any) {
    const docRef = doc(this.firestore, col, docName);
    return setDoc(docRef, data);
  }

  async getDocument<T = any>(col: string, docName: string) {
    const docRef = doc(this.firestore, col, docName);
    const fetchedDoc = await getDoc(docRef);

    return { uid: fetchedDoc.id as string, data: fetchedDoc.data() as T };
  }

  async deleteDocument(col: string, docName: string) {
    await deleteDoc(doc(this.firestore, col, docName));
  }

  async addDocument(col: string, data: any) {
    const colRef = collection(this.firestore, col);
    await addDoc(colRef, data);
  }

  async updateDocument(col: string, docName: string, data: any) {
    const docRef = doc(this.firestore, col, docName);
    await updateDoc(docRef, data);
  }

  getTimestamp(date: Date | string) {
    if (typeof date === 'string') {
      return Timestamp.fromDate(new Date(date));
    }
    return Timestamp.fromDate(date);
  }

  collectionSnapshot$(col: string) {
    const colRef = collection(this.firestore, col);
    const q = query(colRef);

    return collectionData(q, { idField: 'uid' });
  }
}
