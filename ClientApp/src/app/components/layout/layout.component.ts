import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { UserDoc } from 'src/app/shared/models/UserDoc.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  user: User;
  userDoc: UserDoc;

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // At this moment, there always will be user
    this.user = this.auth.currentUser!;
    this.firestoreService
      .getDocument('users', this.user.uid)
      .then((doc: UserDoc) => {
        this.userDoc = doc;
      });
  }

  async logout() {
    await this.auth.signOut();
    this.toastService.success('Pomyślnie wylogowano');
    this.router.navigate(['/login']);
  }
}
