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

  async deleteEmployee(userUid: string) {
    const res: any = await this.authService.deleteUser(userUid);
    return res.data.data as string;
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

  async onEmployeeDelete(userUid: string) {
    this.loading = true;

    if (this.userTriesToDeleteHisAccount(userUid)) {
      this.toastService.error('Nie możesz usunąć swojego konta!');
      this.loading = false;
      return;
    }

    try {
      const status = await this.deleteEmployee(userUid);

      switch (status) {
        case 'Not enough permissions!':
          this.toastService.error('Nie posiadasz uprawnień!');
          break;

        case 'User successfully deleted!':
          this.toastService.success('Usunięto użytkownika!');
          break;

        default:
          break;
      }
    } catch (error: any) {
      this.toastService.error(error.message);
    }
    this.loading = false;
  }

  onClick(event: any, userUid: string) {
    if (event.target.nodeName !== 'TD') return;

    this.router.navigate(['/manage-employees', userUid]);
  }
}
