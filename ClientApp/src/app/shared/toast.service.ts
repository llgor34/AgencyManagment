import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success('Sukces!', message, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  error(message: string) {
    this.toastr.error('Błąd!', message, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }
}
