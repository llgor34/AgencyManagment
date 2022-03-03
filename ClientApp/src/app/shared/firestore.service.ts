import { Injectable } from '@angular/core';
import { Firestore, setDoc, doc, getDoc } from '@angular/fire/firestore';

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
}
