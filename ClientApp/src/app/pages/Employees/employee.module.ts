import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';

import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ManageEmployeeComponent } from './manage-employee/manage-employee.component';
import { ManageEmployeesComponent } from './manage-employees/manage-employees.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [EmployeeRoutingModule, SharedModule],
  declarations: [
    CreateEmployeeComponent,
    ManageEmployeeComponent,
    ManageEmployeesComponent,
    NewEmployeeComponent,
  ],
})
export class EmployeeModule {}
