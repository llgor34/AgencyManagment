import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { UserCredentials } from 'src/app/shared/UserCredientials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private auth: Auth,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    authState(this.auth).subscribe((user) => {
      if (user) {
        this.toastService.success(`Pomyślnie zalogowano!`);
        this.router.navigate(['/home']);
      }
    });
  }

  onSubmit(data: UserCredentials) {
    this.authService.login(data.email, data.password!).catch((res) => {
      if (res.message == 'Firebase: Error (auth/user-not-found).') {
        this.toastService.error('Konto o podanym adresie email, nie istnieje!');
      } else {
        this.toastService.error('Niepoprawne hasło!');
      }
    });
  }
}
