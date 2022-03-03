import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { UserDoc } from 'src/app/shared/UserDoc.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  user: User;
  userDoc: UserDoc;

  constructor(private auth: Auth, private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    // At this moment, there always will be user
    this.user = this.auth.currentUser!;
    this.firestoreService
      .getDocument('users', this.user.uid)
      .then((doc: UserDoc) => (this.userDoc = doc));
  }

  get roles() {
    const allRoles = this.userDoc.data.roles;
    const ownedRoles = Object.keys(allRoles).filter((key) => allRoles[key]);

    return ownedRoles.toString();
  }
}
