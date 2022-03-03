import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from '@angular/fire/auth';
import { PhoneAuthProvider } from 'firebase/auth';
import { FirestoreService } from '../shared/firestore.service';
import { UserDoc } from '../shared/UserDoc.model';

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

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  getRoles(userDoc: UserDoc) {
    const allRoles = userDoc.data.roles;
    const ownedRoles = Object.keys(allRoles).filter((key) => allRoles[key]);

    return ownedRoles.toString();
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
}
