import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { LoggedUserGuard } from './guards/loggedUser-guard.service';
import { NewEmployeeGuard } from './guards/new-employee.service';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

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
      // Adding here NewEmployeeGuard will cause endless loop that queries database!
      {
        path: 'manage-employees',
        loadChildren: () =>
          import('./pages/Employees/employee.module').then(
            (m) => m.EmployeeModule
          ),
      },
      {
        path: 'projects',
        loadChildren: () =>
          import('./pages/projectsManagment/projects-managment.module').then(
            (m) => m.ProjectsManagmentModule
          ),
        canActivate: [NewEmployeeGuard],
      },
      {
        path: 'admin-settings',
        loadChildren: () =>
          import('./pages/admin-settings/admin-settings.module').then(
            (m) => m.AdminSettingsModule
          ),
        canActivate: [NewEmployeeGuard],
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
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
