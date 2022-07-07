import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { UserDocRaw } from '../models/UserDoc.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    private functions: Functions,
    private http: HttpClient
  ) {}

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    const userDoc = await this.firestoreService.getDocument<UserDocRaw>(
      'users',
      res.user.uid
    );

    localStorage.setItem('userDoc', JSON.stringify(userDoc.data));
  }

  async logout() {
    localStorage.removeItem('userDoc');
    return await this.auth.signOut();
  }

  createUser(email: string, password: string) {
    // const createUsr = httpsCallable(this.functions, 'createUser');
    // return await createUsr({ email, password });
    return this.http.post('/api/functions/createUser', {
      email,
      password,
      userUid: this.auth.currentUser!.uid,
    });
  }

  deleteUser(userToDeleteUid: string) {
    // const delUser = httpsCallable(this.functions, 'deleteUser');
    // return await delUser({ userUid });
    return this.http.post('/api/functions/deleteUser', {
      userToDeleteUid,
      userUid: this.auth.currentUser!.uid,
    });
  }

  async updateNewUser(phoneNumber: string, displayName: string) {
    await updateProfile(this.auth.currentUser!, {
      displayName,
    });

    await this.firestoreService.updateDocument(
      'users',
      this.auth.currentUser!.uid,
      { displayName, phoneNumber, newUser: false }
    );
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  isAdmin() {
    return JSON.parse(localStorage.getItem('userDoc')!).roles['admin'];
  }
}
