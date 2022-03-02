import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ToastService } from '../shared/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private toast: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user) => {
        return !!user;
      }),
      tap((user) => {
        if (!user) {
          this.toast.error(
            'Aby uzyskać dostęp do tej strony, musisz się zalogować!'
          );
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
