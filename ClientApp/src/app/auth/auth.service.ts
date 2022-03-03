import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { FirestoreService } from '../shared/firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

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
      roles: {
        admin: false,
        employee: true,
      },
    });

    return user;
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }
}
