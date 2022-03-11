import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { TaskDialogComponent } from 'src/app/components/dialogs/task-dialog/task-dialog.component';
import { BoardService } from 'src/app/shared/board.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Board } from 'src/app/shared/models/Board.model';
import { Task } from 'src/app/shared/models/Board.model';
import { Project } from 'src/app/shared/models/Projects';
import { UserDocRaw } from 'src/app/shared/models/UserDoc.model';
import { ToastService } from 'src/app/shared/toast.service';

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
    private toastService: ToastService,
    private router: Router
  ) {}

  project: { uid: string; data: Project };
  userDoc: UserDocRaw;

  ngOnInit(): void {
    const { uid } = this.route.snapshot.params;
    this.userDoc = JSON.parse(localStorage.getItem('userDoc')!);
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
    if (!this.isAdmin) {
      this.toastService.error('Nie posiadasz uprawnień!');
      return;
    }

    try {
      await this.firestoreService.deleteDocument('projects', this.project.uid);
      this.toastService.success('Usunięto projekt!');
      this.router.navigateByUrl('/projects');
    } catch (error: any) {
      this.toastService.error(error.message);
    }
  }

  get isAdmin() {
    return this.userDoc.roles['admin'];
  }
}
