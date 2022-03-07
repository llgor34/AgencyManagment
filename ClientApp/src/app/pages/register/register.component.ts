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
  private authSub: Subscription;
  loading = false;

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
        this.router.navigate(['/new-employee']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  async onSubmit(data: UserCredentials) {
    this.loading = true;
    try {
      await this.authService.register(data.email, data.password!);
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        this.toastService.error('Ten adres email jest już zajęty!');
      } else {
        this.toastService.error(error.message);
      }
    }
    this.loading = false;
  }
}
