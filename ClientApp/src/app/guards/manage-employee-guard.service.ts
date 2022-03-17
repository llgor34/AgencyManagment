import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ManageEmployeeGuard implements CanActivate {
  constructor(
    private toastService: ToastService,
    private router: Router,
    private firestoreService: FirestoreService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (route.params['uid']) {
      return this.firestoreService
        .getDocument('users', route.params['uid'])
        .then((userDoc) => {
          if (!userDoc.data) {
            return this.throwError();
          } else {
            return true;
          }
        })
        .catch((err) => {
          return this.throwError();
        });
    } else {
      return this.throwError();
    }
  }

  private throwError() {
    this.toastService.error('Nie ma takiego użytkownika!');
    return this.router.createUrlTree(['/home']);
  }
}
