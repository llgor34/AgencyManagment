import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { LoggedUserGuard } from './auth/loggedUser-guard.service';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ManageEmployeesComponent } from './pages/manage-employees/manage-employees.component';
import { RegisterComponent } from './pages/register/register.component';
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
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'manage-employees',
        component: ManageEmployeesComponent,
        canActivate: [AuthGuard],
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
    path: 'register',
    component: RegisterComponent,
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
