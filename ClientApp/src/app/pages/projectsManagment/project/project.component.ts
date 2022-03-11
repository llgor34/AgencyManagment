import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class ProjectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private boardService: BoardService
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

  onListDropped(event: CdkDragDrop<Task[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.boardService.updateTasks(this.project.uid, this.boards);
  }
}
