import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { labelColors, Task } from 'src/app/shared/models/Board.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task | null
  ) {}

  @ViewChild('form') form: NgForm;

  labels: labelColors[] = ['blue', 'green', 'red', 'yellow'];
  editMode = false;

  ngOnInit(): void {
    if (!this.task) {
      this.task = {
        title: '',
        description: '',
        label: 'red',
      };
    } else {
      this.editMode = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.task);
  }

  deleteTask() {
    this.dialogRef.close('delete');
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
