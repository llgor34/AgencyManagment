import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastService } from '../shared/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ManageEmployeeGuard implements CanActivate {
  constructor(private toastService: ToastService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!route.params['uid']) {
      this.toastService.error('Nie wybrano żadnego użytkownika!');
      return this.router.createUrlTree(['/home']);
    }
    return true;
  }
}
