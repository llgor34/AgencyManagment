import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserCredentials } from 'src/app/models/UserCredientials.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  handleSuccess() {
    this.toastService.success('Wiadomość z instrukcją została wysłana!');
  }

  handleError(error: any) {
    switch (error.message) {
      case 'Firebase: Error (auth/user-not-found).':
        this.toastService.error('Konto z takim adresem email nie istnieje!');
        break;

      default:
        this.toastService.error(error.message);
        break;
    }
  }

  async resetPassword(data: UserCredentials) {
    await this.authService.resetPassword(data.email);
  }

  async onSubmit(data: UserCredentials) {
    this.loading = true;

    try {
      await this.resetPassword(data);
      this.handleSuccess();
    } catch (error: any) {
      this.handleError(error);
    }

    this.loading = false;
  }
}
