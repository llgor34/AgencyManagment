import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, this.checkPasswordsValidity]],
    });
    this.loading = false;
  }

  get password() {
    return this.form?.controls['password'];
  }

  get passwordConfirm() {
    return this.form?.controls['passwordConfirm'];
  }

  get email() {
    return this.form?.controls['email'];
  }

  get passwordEmpty() {
    return !!this.form.controls['password'].getError('required');
  }

  get passwordTooShort() {
    return !!this.form.controls['password'].getError('minlength');
  }

  checkPasswordsValidity = () => {
    if (
      this.form?.controls['password'].value !==
      this.form?.controls['passwordConfirm'].value
    ) {
      return { passwordsNotMatch: true };
    }
    return null;
  };

  async onSubmit() {
    this.loading = true;
    try {
      const res: any = await this.authService.createUser(
        this.email.value,
        this.password.value
      );

      if (res.data.data === 'User successfully created!') {
        this.form.reset();
        this.toastService.success('Utworzono nowego użytkownika!');
        this.router.navigate(['/manage-employees']);
      }

      if (res.data.data === 'Not enough permissions!') {
        this.toastService.error('Nie posiadasz wystarczających uprawnień!');
        this.form.reset();
      }
    } catch (error: any) {
      this.toastService.error(error);
    }
    this.loading = false;
  }
}
