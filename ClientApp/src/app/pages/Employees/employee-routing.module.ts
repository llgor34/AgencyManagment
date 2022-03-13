import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin-guard.service';
import { ManageEmployeeGuard } from 'src/app/guards/manage-employee-guard.service';
import { NewEmployeeGuard } from 'src/app/guards/new-employee.service';
import { OnlyNewEmployeeGuard } from 'src/app/guards/only-new-employee-guard.service';

import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';

const routes: Routes = [
  {
    path: '',
    component: ManageEmployeesComponent,
    canActivate: [NewEmployeeGuard, AdminGuard],
  },
  {
    path: 'create-employee',
    component: CreateEmployeeComponent,
    canActivate: [NewEmployeeGuard, AdminGuard],
  },
  {
    path: 'new-employee',
    component: NewEmployeeComponent,
    canActivate: [OnlyNewEmployeeGuard],
  },
  {
    path: ':uid',
    component: ManageEmployeeComponent,
    canActivate: [ManageEmployeeGuard, AdminGuard, NewEmployeeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
