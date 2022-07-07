import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

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
    this.initializeForm();
    this.loading = false;
  }

  initializeForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, this.checkPasswordsValidity]],
    });
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

  createUser() {
    this.loading = true;
    this.authService
      .createUser(this.email.value, this.password.value)
      .subscribe((res: any) => {
        this.loading = false;

        if (res.status === 'success') {
          this.handleSuccess();
          return;
        }
        this.handleError();
      });
  }

  handleSuccess() {
    this.form.reset();
    this.toastService.success('Utworzono nowego użytkownika!');
    this.router.navigate(['/manage-employees']);
  }

  handleError() {
    this.toastService.error('Nie posiadasz wystarczających uprawnień!');
    this.form.reset();
  }

  async onSubmit() {
    this.createUser();
  }
}
