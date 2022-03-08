import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { UserDoc } from 'src/app/shared/models/UserDoc.model';

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
    private authService: AuthService,
    private route: ActivatedRoute
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
}
