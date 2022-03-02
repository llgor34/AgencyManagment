import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';
import { authState } from 'rxfire/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.initializeForm();

    authState(this.auth).subscribe((user) => {
      if (user) {
        this.toastService.success(`Pomyślnie zalogowano!`);
        this.router.navigate(['/home']);
      }
    });
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  get passwordTooShort() {
    return !!this.loginForm.controls['password'].getError('minlength');
  }

  get passwordEmpty() {
    return !!this.loginForm.controls['password'].getError('required');
  }

  resetForm() {
    this.loginForm.reset();
  }

  onSubmit() {
    this.authService
      .login(this.email.value, this.password.value)
      .catch((res) => {
        if (res.message == 'Firebase: Error (auth/user-not-found).') {
          this.toastService.error(
            'Konto o podanym adresie email, nie istnieje!'
          );
        }
      });
  }
}
