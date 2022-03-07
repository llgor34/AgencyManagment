import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Employee } from 'src/app/shared/Employee.model';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit, OnDestroy {
  collectionSub: Subscription;
  employees: Employee[];
  loading = false;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private toastService: ToastService,
    private auth: Auth
  ) {}

  private empty(text: string) {
    return text.trim().length === 0;
  }

  ngOnInit(): void {
    this.collectionSub = this.firestoreService
      .collectionSnapshot$('users')
      .subscribe((documents) => {
        this.employees = documents.map(
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
      });
  }

  ngOnDestroy(): void {
    this.collectionSub.unsubscribe();
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

    if (userUid === this.auth.currentUser?.uid) {
      this.toastService.error('Nie możesz usunąć swojego konta!');
      this.loading = false;
      return;
    }

    try {
      const res: any = await this.authService.deleteUser(userUid);
      if (res.data.data == 'Not enough permissions!') {
        this.toastService.error('Nie posiadasz uprawnień!');
      } else {
        this.toastService.success('Usunięto użytkownika!');
      }
    } catch (error: any) {
      this.toastService.error(error.message);
    }

    this.loading = false;
  }
}
