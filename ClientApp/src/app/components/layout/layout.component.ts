import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  user: User;
  constructor(private auth: Auth) {}

  ngOnInit(): void {
    // At this moment, there always will be user
    this.user = this.auth.currentUser!;
  }
}
