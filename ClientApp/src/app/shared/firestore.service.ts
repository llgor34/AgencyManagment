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
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async setDocument(col: string, docName: string, data: any) {
    const docRef = doc(this.firestore, col, docName);
    return setDoc(docRef, data);
  }

  async getDocument(col: string, docName: string) {
    const docRef = doc(this.firestore, col, docName);
    const fetchedDoc = await getDoc(docRef);

    return { uid: fetchedDoc.id, data: fetchedDoc.data() as any };
  }

  async updateDocument(col: string, docName: string, data: any) {
    const docRef = doc(this.firestore, col, docName);
    await updateDoc(docRef, data);
  }

  collectionSnapshot$(col: string) {
    const colRef = collection(this.firestore, col);
    const q = query(colRef);

    return collectionData(q, { idField: 'id' });
  }
}
