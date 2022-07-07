import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Employee } from 'src/app/models/Employee.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastService } from 'src/app/services/toast.service';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit, OnDestroy {
  collectionSub: Subscription;
  employees: Employee[];
  loading = false;
  firstCheck = true;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private toastService: ToastService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.collectionSub.unsubscribe();
  }

  private empty(text: string) {
    if (text) {
      return text.trim().length === 0;
    }
    return true;
  }

  fetchUsers() {
    this.collectionSub = this.firestoreService
      .collectionSnapshot$('users')
      .pipe(
        map((documents) => {
          return documents.map(
            (document) =>
              new Employee(
                this.empty(document['displayName'])
                  ? 'Nie ustawiono'
                  : document['displayName'],
                document['email'],
                this.empty(document['phoneNumber'])
                  ? 'Nie ustawiono'
                  : `+48${document['phoneNumber']}`,
                document['roles'],
                document['uid']
              )
          );
        })
      )
      .subscribe((employees) => {
        this.employees = employees;
        if (this.firstCheck) {
          this.loading = false;
        }
      });
  }

  userTriesToDeleteHisAccount(userUid: string) {
    return userUid === this.auth.currentUser?.uid;
  }

  deleteEmployee(userUid: string) {
    this.authService.deleteUser(userUid).subscribe((res: any) => {
      this.loading = false;
      if (res.status === 'success') {
        this.toastService.success('Usunięto użytkownika!');
        return;
      }
      this.toastService.error('Nie posiadasz uprawnień!');
    });
  }

  async onPasswordReset(email: string) {
    this.loading = true;
    try {
      await this.authService.resetPassword(email);
      this.toastService.success(
        `Wysłano wiadomość z instrukcją resetu hasła na adres: ${email}`
      );
    } catch (error: any) {
      this.toastService.error(`Wystąpił nieoczekiwany błąd: ${error.message}`);
    }
    this.loading = false;
  }

  onEmployeeDelete(userUid: string) {
    this.loading = true;

    if (this.userTriesToDeleteHisAccount(userUid)) {
      this.toastService.error('Nie możesz usunąć swojego konta!');
      this.loading = false;
      return;
    }

    this.deleteEmployee(userUid);
  }

  onClick(event: any, userUid: string) {
    if (event.target.nodeName !== 'TD') return;

    this.router.navigate(['/manage-employees', userUid]);
  }
}
