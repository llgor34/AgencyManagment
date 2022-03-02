import { Injectable } from '@angular/core';
import { Firestore, setDoc, collection, doc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async setDocument(col: string, docName: string, data: any) {
    const docRef = doc(this.firestore, col, docName);
    return setDoc(docRef, data);
  }
}
