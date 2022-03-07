import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { FirestoreService } from '../shared/firestore.service';
import { ToastService } from '../shared/toast.service';

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
    this.toastService.error('Niema takiego użytkownika!');
    return this.router.createUrlTree(['/home']);
  }
}
