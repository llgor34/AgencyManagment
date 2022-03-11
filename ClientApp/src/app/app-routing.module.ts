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
import { ProjectsComponent } from './pages/projectsManagment/projects/projects.component';
import { ProjectsContainerComponent } from './pages/projectsManagment/projects-container/projects-container.component';
import { AddProjectComponent } from './pages/projectsManagment/add-project/add-project.component';
import { ProjectComponent } from './pages/projectsManagment/project/project.component';
import { EditProjectComponent } from './pages/projectsManagment/edit-project/edit-project.component';

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
      // Manage employees routes (at the end, they will be outsourced to own module and lazy loaded)
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
      // Manage projects routes (at the end, they will be outsourced to own module and lazy loaded)
      {
        path: 'projects',
        component: ProjectsContainerComponent,
        canActivate: [NewEmployeeGuard],
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: ProjectsComponent,
          },
          {
            path: 'add-project',
            component: AddProjectComponent,
          },
          {
            path: 'edit-project/:uid',
            component: EditProjectComponent,
          },
          {
            path: ':uid',
            pathMatch: 'full',
            component: ProjectComponent,
          },
        ],
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
