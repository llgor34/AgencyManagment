import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserCredentials } from 'src/app/models/UserCredientials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  loading = false;

  constructor(
    private auth: Auth,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authSub = authState(this.auth).subscribe((user) => {
      if (user) {
        this.toastService.success(`Pomyślnie zalogowano!`);
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onSubmit(data: UserCredentials) {
    this.loading = true;
    this.authService.login(data.email, data.password!).catch((res) => {
      if (res.message == 'Firebase: Error (auth/user-not-found).') {
        this.toastService.error('Konto o podanym adresie email, nie istnieje!');
      } else {
        this.toastService.error('Niepoprawne hasło!');
      }
    });
    this.loading = false;
  }
}
