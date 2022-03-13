import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/guards/admin-guard.service';
import { IsAssignedToProjectGuard } from 'src/app/guards/is-assigned-to-project-guard.service';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProjectsComponent,
  },
  {
    path: 'add-project',
    component: AddProjectComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'edit-project/:uid',
    component: EditProjectComponent,
    canActivate: [AdminGuard],
  },
  {
    path: ':uid',
    pathMatch: 'full',
    component: ProjectComponent,
    canActivate: [IsAssignedToProjectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
