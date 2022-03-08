import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/shared/models/UserCredientials.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @Input() mode: 'login' | 'reset';
  @Input() loading: boolean;
  @Output() formSubmitted = new EventEmitter<UserCredentials>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    const passwordValidators = [];
    const passwordConfirmValidators = [];

    if (this.mode === 'login') {
      passwordValidators.push(Validators.required);
      passwordValidators.push(Validators.minLength(6));
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', passwordValidators],
    });
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get passwordTooShort() {
    return !!this.form.controls['password'].getError('minlength');
  }

  get passwordEmpty() {
    return !!this.form.controls['password'].getError('required');
  }

  get formLabel() {
    switch (this.mode) {
      case 'login':
        return 'Zaloguj się';
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
