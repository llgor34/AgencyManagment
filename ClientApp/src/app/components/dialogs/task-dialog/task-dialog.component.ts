import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { labelColors, Task } from 'src/app/models/Board.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { tasks: Task[]; task: Task | null }
  ) {}

  @ViewChild('form') form: NgForm;

  labels: labelColors[] = ['blue', 'green', 'red', 'yellow'];
  editMode = false;

  ngOnInit(): void {
    if (this.data.task) {
      this.editMode = true;
    } else {
      this.data.task = {
        title: '',
        description: '',
        label: 'red',
      };
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.editMode) {
      this.data.tasks.push({
        title: this.titleControl.value,
        description: this.descriptionControl.value,
        label: this.labelControl.value,
      });
      this.dialogRef.close();
    } else {
      this.data.task!.title = this.titleControl.value;
      this.data.task!.description = this.descriptionControl.value;
      this.data.task!.label = this.labelControl.value;
      this.dialogRef.close();
    }
  }

  deleteTask() {
    const index = this.data.tasks.indexOf(this.data.task!);
    this.data.tasks.splice(index, 1);
    // this.data.tasks = this.data.tasks.filter(
    //   (task, taskIndex) => taskIndex !== index
    // );
    this.dialogRef.close();
  }

  get titleControl() {
    return this.form?.controls['title'];
  }

  get descriptionControl() {
    return this.form?.controls['description'];
  }

  get labelControl() {
    return this.form?.controls['label'];
  }
}
