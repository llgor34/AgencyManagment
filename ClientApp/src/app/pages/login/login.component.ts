import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.loginForm.controls['username'];
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
    console.log(this.loginForm);
  }
}
