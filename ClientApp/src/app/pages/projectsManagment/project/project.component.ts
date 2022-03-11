import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskDialogComponent } from 'src/app/components/dialogs/task-dialog/task-dialog.component';
import { BoardService } from 'src/app/shared/board.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Board } from 'src/app/shared/models/Board.model';
import { Task } from 'src/app/shared/models/Board.model';
import { Project } from 'src/app/shared/models/Projects';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private boardService: BoardService,
    private dialog: MatDialog
  ) {}

  private dialogSub: Subscription;
  project: { uid: string; data: Project };

  ngOnInit(): void {
    const { uid } = this.route.snapshot.params;
    this.firestoreService.getDocument<Project>('projects', uid).then((res) => {
      this.project = res;
    });
  }

  ngOnDestroy(): void {
    this.dialogSub.unsubscribe();
  }

  get boards() {
    return this.project.data.boards as Board;
  }

  updateTasks() {
    this.boardService.updateTasks(this.project.uid, this.boards);
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

  openDialog = (tasks: Task[], task: Task | null = null) => {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task,
    });

    this.dialogSub = dialogRef
      .afterClosed()
      .subscribe((result: Task | string) => {
        if (!result) return;

        if (typeof result !== 'string') {
          let existingTask = tasks.indexOf(result);
          if (existingTask === -1) {
            tasks.push(result);
          } else {
            tasks[existingTask] = result;
          }
        }

        this.updateTasks();
      });
  };
}
