import { Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { switchMap, of } from 'rxjs';
import { FirestoreService } from '../shared/firestore.service';
import { ToastService } from '../shared/toast.service';
import { UserDoc } from '../models/UserDoc.model';

@Injectable({
  providedIn: 'root',
})
export class OnlyNewEmployeeGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private toast: ToastService,
    private firestoreService: FirestoreService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (user) {
          return this.firestoreService
            .getDocument('users', user.uid)
            .then((doc: UserDoc) => {
              if (doc.data.newUser) {
                return true;
              } else {
                this.toast.error('Dane zostały już wypełnione!');
                return this.router.createUrlTree(['/home']);
              }
            });
        } else {
          return of(false);
        }
      })
    );
  }
}
