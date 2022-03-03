import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit {
  employees = [1, 2, 3, 4, 5];

  constructor() {}

  ngOnInit(): void {}
}
