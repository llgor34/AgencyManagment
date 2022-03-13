import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { ProjectsComponent } from './pages/projectsManagment/projects/projects.component';
import { ProjectsContainerComponent } from './pages/projectsManagment/projects-container/projects-container.component';
import { AddProjectComponent } from './pages/projectsManagment/add-project/add-project.component';
import { ProjectComponent } from './pages/projectsManagment/project/project.component';
import { TaskDialogComponent } from './components/dialogs/task-dialog/task-dialog.component';
import { BoardComponent } from './components/board/board.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { EditProjectComponent } from './pages/projectsManagment/edit-project/edit-project.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    LayoutComponent,
    FormComponent,
    ResetPasswordComponent,
    ProjectsComponent,
    ProjectsContainerComponent,
    AddProjectComponent,
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
    SharedModule,
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
