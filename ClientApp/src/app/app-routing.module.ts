import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { LoggedUserGuard } from './auth/loggedUser-guard.service';
import { NewEmployeeGuard } from './auth/new-employee.service';
import { OnlyNewEmployeeGuard } from './auth/only-new-employee-guard.service';
import { LayoutComponent } from './components/layout/layout.component';
import { ManageEmployeeComponent } from './pages/Employees/manage-employee/manage-employee.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageEmployeesComponent } from './pages/Employees/manage-employees/manage-employees.component';
import { NewEmployeeComponent } from './pages/Employees/new-employee/new-employee.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ManageEmployeeGuard } from './auth/manage-employee-guard.service';
import { CreateEmployeeComponent } from './pages/Employees/create-employee/create-employee.component';
import { AdminGuard } from './auth/admin-guard.service';

const routes: Routes = [
  // redirect routes
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },

  // routes for logged in user
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [NewEmployeeGuard],
      },
      {
        path: 'manage-employees',
        component: ManageEmployeesComponent,
        canActivate: [NewEmployeeGuard, AdminGuard],
      },
      {
        path: 'manage-employee/:uid',
        component: ManageEmployeeComponent,
        canActivate: [ManageEmployeeGuard, AdminGuard, NewEmployeeGuard],
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
    ],
  },

  // routes for not logged in user
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedUserGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [LoggedUserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
