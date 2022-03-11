import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent } from './components/layout/layout.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { FormComponent } from './components/form/form.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ManageEmployeesComponent } from './pages/Employees/manage-employees/manage-employees.component';
import { NewEmployeeComponent } from './pages/Employees/new-employee/new-employee.component';
import { ButtonComponent } from './components/button/button.component';
import { GetRolesPipe } from './pipes/get-roles.pipe';
import { ManageEmployeeComponent } from './pages/Employees/manage-employee/manage-employee.component';
import { PlusIconComponent } from './components/plus-icon/plus-icon.component';
import { CreateEmployeeComponent } from './pages/Employees/create-employee/create-employee.component';
import { ProjectsComponent } from './pages/projectsManagment/projects/projects.component';
import { ProjectsContainerComponent } from './pages/projectsManagment/projects-container/projects-container.component';
import { AddProjectComponent } from './pages/projectsManagment/add-project/add-project.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProjectComponent } from './pages/projectsManagment/project/project.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskDialogComponent } from './components/dialogs/task-dialog/task-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BoardComponent } from './components/board/board.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { EditProjectComponent } from './pages/projectsManagment/edit-project/edit-project.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    FormComponent,
    ResetPasswordComponent,
    ManageEmployeesComponent,
    NewEmployeeComponent,
    ButtonComponent,
    GetRolesPipe,
    ManageEmployeeComponent,
    PlusIconComponent,
    CreateEmployeeComponent,
    ProjectsComponent,
    ProjectsContainerComponent,
    AddProjectComponent,
    LoadingSpinnerComponent,
    ProjectComponent,
    TaskDialogComponent,
    BoardComponent,
    ProjectFormComponent,
    EditProjectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
