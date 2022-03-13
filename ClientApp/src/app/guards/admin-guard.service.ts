import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { switchMap } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private toast: ToastService,
    private firestoreService: FirestoreService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return authState(this.auth).pipe(
      switchMap(async (user) => {
        if (!user) {
          localStorage.removeItem('userDoc');
          return false;
        }
        const userDoc = await this.firestoreService.getDocument(
          'users',
          user.uid
        );

        if (userDoc.data.roles['admin']) {
          return true;
        }

        this.toast.error('Nie posiadasz uprawnień do wyświetlenia tej strony!');
        return this.router.createUrlTree(['/home']);
      })
    );
  }
}
