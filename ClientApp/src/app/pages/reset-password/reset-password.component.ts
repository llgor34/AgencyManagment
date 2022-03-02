import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { UserCredentials } from 'src/app/shared/UserCredientials.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  async onSubmit(data: UserCredentials) {
    try {
      await this.authService.resetPassword(data.email);
      this.toastService.success('Wiadomość z instrukcją została wysłana!');
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/user-not-found).') {
        this.toastService.error('Konto z takim adresem email nie istnieje!');
      } else {
        this.toastService.error(error.message);
      }
    }
  }
}
