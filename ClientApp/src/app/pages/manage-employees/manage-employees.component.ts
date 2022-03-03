import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Employee } from 'src/app/shared/Employee.model';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit, OnDestroy {
  collectionSub: Subscription;
  employees: Employee[];

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
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
              [...this.authService.getRoles(document['roles'])],
              document['id']
            )
        );
      });
  }

  ngOnDestroy(): void {
    this.collectionSub.unsubscribe();
  }
}
