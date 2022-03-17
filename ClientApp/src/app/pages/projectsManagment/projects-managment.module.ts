import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BoardComponent } from 'src/app/components/board/board.component';
import { TaskDialogComponent } from 'src/app/components/dialogs/task-dialog/task-dialog.component';
import { ProjectFormComponent } from 'src/app/components/project-form/project-form.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsContainerComponent } from './projects-container/projects-container.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsRoutingModule } from './projects-managment.routing.module';

@NgModule({
  imports: [SharedModule, ProjectsRoutingModule],
  declarations: [
    ProjectsComponent,
    ProjectsContainerComponent,
    AddProjectComponent,
    ProjectComponent,
    TaskDialogComponent,
    BoardComponent,
    ProjectFormComponent,
    EditProjectComponent,
  ],
})
export class ProjectsManagmentModule {}
