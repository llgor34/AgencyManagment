import { Component, OnInit } from '@angular/core';
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
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit(form: NgForm) {
    this.loading = true;
    const { phoneNumber, displayName } = form.form.controls;

    try {
      await this.authService.updateNewUser(
        phoneNumber.value,
        displayName.value
      );

      this.toastService.success('Dane zostały zaktualizowane!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.toastService.error(error.message);
    }
    this.loading = false;
  }
}
