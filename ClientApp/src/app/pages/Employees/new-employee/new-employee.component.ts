import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css'],
})
export class NewEmployeeComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async updateNewUser() {
    const { phoneNumber, displayName } = this.form.controls;
    await this.authService.updateNewUser(phoneNumber.value, displayName.value);
  }

  handleSuccess() {
    this.toastService.success('Dane zostały zaktualizowane!');
    this.router.navigate(['/home']);
  }

  handleError(error: any) {
    this.toastService.error(error.message);
  }

  async onSubmit() {
    this.loading = true;

    try {
      await this.updateNewUser();
      this.handleSuccess();
    } catch (error) {
      this.handleError(error);
    }

    this.loading = false;
  }
}
