import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/shared/models/Board.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @Input('tasks') tasks: Task[];
  @Output('onDialogOpen') dialogOpen = new EventEmitter<{
    tasks: Task[];
    task: Task | null;
  }>();
  @Output('onListDropped') onListDropped = new EventEmitter<
    CdkDragDrop<Task[]>
  >();
  @Input('completed') completed = false;

  constructor() {}

  ngOnInit(): void {}

  openDialog = (task: Task | null = null) => {
    this.dialogOpen.emit({ tasks: this.tasks, task });
  };

  onListDrop(event: CdkDragDrop<Task[]>) {
    this.onListDropped.emit(event);
  }
}
