import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from '@angular/fire/auth';
import { FirestoreService } from '../shared/firestore.service';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    private functions: Functions
  ) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    const { user } = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    await this.firestoreService.setDocument('users', user.uid, {
      email: user.email,
      displayName: '',
      phoneNumber: '',
      newUser: true,
      roles: {
        admin: false,
        employee: true,
      },
    });

    return user;
  }

  async createUser(email: string, password: string) {
    const createUsr = httpsCallable(this.functions, 'createUser');
    return await createUsr({ email, password });
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
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

  async deleteUser(userUid: string) {
    const delUser = httpsCallable(this.functions, 'deleteUser');
    return await delUser({ userUid });
  }
}
