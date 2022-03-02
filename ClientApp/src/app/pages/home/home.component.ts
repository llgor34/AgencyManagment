import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.auth.signOut();
    this.toastService.success('Pomyślnie wylogowano');
    this.router.navigate(['/login']);
  }
}
