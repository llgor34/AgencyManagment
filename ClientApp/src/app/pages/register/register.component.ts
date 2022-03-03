import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { UserCredentials } from 'src/app/shared/UserCredientials.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  authSub: Subscription;

  constructor(
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe((user) => {
      if (user) {
        this.toastService.success(`Pomyślnie zarejestrowano!`);
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  async onSubmit(data: UserCredentials) {
    try {
      await this.authService.register(data.email, data.password!);
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        this.toastService.error('Ten adres email jest już zajęty!');
      } else {
        this.toastService.error(error.message);
      }
    }
  }
}
