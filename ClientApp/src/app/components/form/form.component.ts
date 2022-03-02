import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/shared/UserCredientials.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @Input() mode: 'login' | 'register' | 'reset';
  @Output() formSubmitted = new EventEmitter<UserCredentials>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const passwordValidators = [];
    const passwordConfirmValidators = [];

    if (this.mode === 'register') {
      passwordConfirmValidators.push(Validators.required);
    }

    if (this.mode === 'login' || this.mode === 'register') {
      passwordValidators.push(Validators.required);
      passwordValidators.push(Validators.minLength(6));
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidators],
      passwordConfirm: ['', passwordConfirmValidators],
    });
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get passwordConfirm() {
    return this.form.controls['passwordConfirm'];
  }

  get passwordTooShort() {
    return !!this.form.controls['password'].getError('minlength');
  }

  get passwordEmpty() {
    return !!this.form.controls['password'].getError('required');
  }

  get passwordMatches() {
    return this.password.value === this.passwordConfirm.value;
  }

  checkPasswordsValidity() {
    if (this.password.value !== this.passwordConfirm.value) {
      this.passwordConfirm.setErrors({ passwordsNotMatch: true });
    } else {
      if (this.passwordConfirm.errors) {
        delete this.passwordConfirm.errors['passwordNotMatch'];
      }
    }
  }

  get formLabel() {
    switch (this.mode) {
      case 'login':
        return 'Zaloguj się';
      case 'register':
        return 'Zarejestruj się';
      case 'reset':
        return 'Resetowanie hasła';
    }
  }

  resetForm() {
    this.form.reset();
  }

  onSubmit() {
    switch (this.mode) {
      case 'login':
      case 'register':
        this.formSubmitted.next({
          email: this.email.value,
          password: this.password.value,
        });
        this.resetForm();
        break;

      case 'reset':
        this.formSubmitted.next({ email: this.email.value });
        this.resetForm();
        break;
    }
  }
}
