import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskDialogComponent } from 'src/app/components/dialogs/task-dialog/task-dialog.component';
import { BoardService } from 'src/app/shared/board.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Board } from 'src/app/models/Board.model';
import { Task } from 'src/app/models/Board.model';
import { Project } from 'src/app/models/Projects';
import { ProjectsService } from 'src/app/shared/projects.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private boardService: BoardService,
    private dialog: MatDialog,
    private projectsService: ProjectsService,
    private authService: AuthService
  ) {}

  project: { uid: string; data: Project };

  ngOnInit(): void {
    const { uid } = this.route.snapshot.params;
    this.firestoreService.getDocument<Project>('projects', uid).then((res) => {
      this.project = res;
    });
  }

  get boards() {
    return this.project.data.boards as Board;
  }

  updateTasks = () => {
    this.boardService.updateTasks(this.project.uid, this.boards);
  };

  async toggleProjectCompleteStatus() {
    await this.projectsService.toggleProjectCompleteStatus(this.project);
  }

  onListDropped(event: CdkDragDrop<Task[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.updateTasks();
  }

  openDialog = (data: { tasks: Task[]; task: Task | null }) => {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data,
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(this.updateTasks);
  };

  async onProjectDelete() {
    await this.projectsService.deleteProject(this.project.uid);
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }
}
