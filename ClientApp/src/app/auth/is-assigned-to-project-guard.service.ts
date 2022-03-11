import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { authState } from 'rxfire/auth';
import { switchMap } from 'rxjs';
import { FirestoreService } from '../shared/firestore.service';
import { Project } from '../shared/models/Projects';
import { UserDocRaw } from '../shared/models/UserDoc.model';
import { ToastService } from '../shared/toast.service';

@Injectable({
  providedIn: 'root',
})
export class IsAssignedToProjectGuard {
  constructor(
    private firestoreService: FirestoreService,
    private toastService: ToastService,
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { uid } = route.params;

    return authState(this.auth).pipe(
      switchMap(async (user) => {
        if (user) {
          const userDoc = await this.firestoreService.getDocument<UserDocRaw>(
            'users',
            user.uid
          );

          if (userDoc.data.roles['admin']) {
            return true;
          }

          const projectDoc = await this.firestoreService.getDocument<Project>(
            'projects',
            uid
          );

          if (projectDoc.data.assignedUsers.includes(user.uid)) {
            return true;
          }

          this.toastService.error(
            'Nie posiadasz uprawnień do wyświetlenia tego projektu'
          );
          return this.router.createUrlTree(['/projects']);
        }
        this.toastService.error(
          'Nie posiadasz uprawnień do wyświetlenia tego projektu'
        );
        return this.router.createUrlTree(['/projects']);
      })
    );
  }
}
