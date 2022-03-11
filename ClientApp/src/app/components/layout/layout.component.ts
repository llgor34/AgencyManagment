import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { UserDocRaw } from 'src/app/shared/models/UserDoc.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  user: User;
  userDoc: UserDocRaw;

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser!;
    this.userDoc = JSON.parse(localStorage.getItem('userDoc')!);
  }

  async logout() {
    await this.authService.logout();
    this.toastService.success('Pomyślnie wylogowano');
    this.router.navigate(['/login']);
  }
}
