import { Component, Input, OnInit } from '@angular/core';
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
  @Input() editMode = false;
  loading = false;
  form: FormGroup;
  templates: ProjectTemplate[];
  selectedProjectTemplate: ProjectTemplate;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initializeForm();
    if (this.editMode) {
      this.boardService.getBoardsTemplates$().subscribe((temps: any) => {
        this.templates = temps;
      });
    }
    this.loading = false;
  }

  updateForm(e: any) {
    this.selectedProjectTemplate = this.templates.filter(
      (template) => template.uid === e.target.value
    )[0];
    this.form.controls['title'].setValue(this.selectedProjectTemplate.title);
    for (let task of this.selectedProjectTemplate.board.assignedTasks) {
      this.onAddTask(task.title, task.description, task.label);
    }
  }

  onChange(e: any) {
    console.log(e.target.value);
  }

  initializeForm() {
    const validators = [];

    if (this.editMode) {
      validators.push(Validators.required);
    }

    this.form = this.fb.group({
      title: ['', Validators.required],
      templateName: ['', validators],
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

  get templateName() {
    return this.form.controls['templateName'];
  }

  onAddTask(title: string = '', description: string = '', label: string = '') {
    const taskControl = this.fb.group({
      title: [title, Validators.required],
      description: [description, Validators.required],
      label: [label, Validators.required],
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
      if (this.editMode) {
        await this.boardService.updateBoardTemplate(
          this.selectedProjectTemplate.uid!,
          projectTemplate
        );
        this.toastService.success('Zaktualizowano templatkę!');
      } else {
        await this.boardService.createNewBoardTemplate(projectTemplate);
        this.toastService.success('Dodano nową templatkę!');
      }
    } catch (error: any) {
      this.toastService.error(error.message);
    }

    this.resetForm();
    this.loading = false;
  }
}
