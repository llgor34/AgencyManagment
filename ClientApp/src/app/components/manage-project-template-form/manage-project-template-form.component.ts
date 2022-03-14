import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProjectTemplate } from 'src/app/models/ProjectTemplate.model';
import { BoardService } from 'src/app/services/board.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-manage-project-template-form',
  templateUrl: './manage-project-template-form.component.html',
  styleUrls: ['./manage-project-template-form.component.css'],
})
export class ManageProjectTemplateFormComponent implements OnInit {
  loading = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initializeForm();
    this.loading = false;
  }

  initializeForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      tasks: this.fb.array([], this.minArrayLength1),
    });
  }

  minArrayLength1 = (control: AbstractControl) => {
    if (control.value.length < 1) {
      return {
        arrayToShort: true,
      };
    }

    return null;
  };

  get tasksControlArray() {
    return this.form.controls['tasks'] as FormArray;
  }

  get title() {
    return this.form.controls['title'];
  }

  onAddTask() {
    const taskControl = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      label: ['', Validators.required],
    });

    this.tasksControlArray.push(taskControl);
  }

  onTaskDelete(index: number) {
    this.tasksControlArray.removeAt(index);
  }

  resetForm() {
    this.tasksControlArray.clear();
    this.form.reset();
  }

  async onFormSubmit() {
    this.loading = true;

    const projectTemplate: ProjectTemplate = {
      title: this.title.value,
      board: {
        assignedTasks: this.tasksControlArray.controls.map((control: any) => ({
          title: control.controls.title.value,
          description: control.controls.description.value,
          label: control.controls.label.value,
        })),
        inProgressTasks: [],
        doneTasks: [],
      },
    };

    try {
      await this.boardService.createNewBoardTemplate(projectTemplate);
      this.toastService.success('Dodano nową templatkę!');
    } catch (error: any) {
      this.toastService.error(error.message);
    }

    this.resetForm();
    this.loading = false;
  }
}
