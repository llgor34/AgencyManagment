import { Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { switchMap, of } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { ToastService } from '../services/toast.service';
import { UserDoc } from '../models/UserDoc.model';

@Injectable({
  providedIn: 'root',
})
export class NewEmployeeGuard implements CanActivate {
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
                this.toast.error(
                  'Aby korzystać z tej strony, wypełnij poniższe informacje!'
                );
                return this.router.createUrlTree(['/new-employee']);
              }
              return true;
            });
        } else {
          return of(false);
        }
      })
    );
  }
}
