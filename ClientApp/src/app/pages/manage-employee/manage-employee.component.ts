import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { take } from 'rxjs';
import { DocumentData } from 'firebase/firestore';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css'],
})
export class ManageEmployeeComponent implements OnInit {
  initialized = false;
  roles: DocumentData[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService
      .collectionSnapshot$('roles')
      .pipe(take(1))
      .subscribe((roles) => {
        this.roles = roles;
      });
  }
}
