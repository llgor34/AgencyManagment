import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { first, firstValueFrom, tap } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Project } from 'src/app/models/Projects';
import { ProjectsService } from 'src/app/services/projects.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProjectTemplate } from 'src/app/models/ProjectTemplate.model';
import { Timestamp } from 'firebase/firestore';
import { Board } from 'src/app/models/Board.model';

interface ProjectToAdd {
  title: string;
  description: string;
  dueDate: Timestamp;
  assignedUsers: string[];
  boards?: Board;
}

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  @Input('mode') mode: 'add' | 'edit';

  loading = false;
  form: FormGroup;
  dropdownList: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  projectUid: string | null = null;
  projectTemplates: ProjectTemplate[];

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private projectsService: ProjectsService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.projectUid = this.route.snapshot.params['uid'];

    firstValueFrom(this.fetchAllUsers()).then(async () => {
      this.initializeForm();
      if (this.mode === 'add') {
        await firstValueFrom(this.fetchProjectsTemplates());
      }
      this.loading = false;
    });
  }

  initializeForm() {
    this.createForm();
    this.createDropdownSettings();

    if (this.mode === 'edit') {
      this.fetchCurrentProject();
    }
  }

  minOneUser = (control: AbstractControl) => {
    if (control.value.length < 1) {
      return { noUserselected: true };
    }
    return null;
  };

  get title() {
    return this.form.controls['title'];
  }

  get description() {
    return this.form.controls['description'];
  }

  get dueDate() {
    return this.form.controls['dueDate'];
  }

  get selectedUsers() {
    return this.form.controls['selectedUsers'];
  }

  createForm() {
    const templateValidators = [];

    if (this.mode === 'add') {
      templateValidators.push(Validators.required);
    }

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      selectedUsers: [[], this.minOneUser],
      template: ['', ...templateValidators],
    });
  }

  createDropdownSettings() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'userUid',
      textField: 'username',
      selectAllText: 'Wybierz wszystkich',
      unSelectAllText: 'Odznacz wszystkich',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: 'Szukaj...',
      noDataAvailablePlaceholderText: 'brak użytkowników!',
    };
  }

  getFormatedDueDate(date: Date) {
    return `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
  }

  getAssignedUsers(usersUid: any[]) {
    const assignedUsers: any[] = [];
    for (let userUid of usersUid) {
      assignedUsers.push(
        this.dropdownList.filter((userList) => userList.userUid === userUid)[0]
      );
    }
    return assignedUsers;
  }

  getAssignedUsersUid(users: { userUid: string; username: string }[]) {
    return users.map((selectedUser) => selectedUser['userUid']);
  }

  getSelectedProjectTemplate() {
    return this.projectTemplates.filter(
      (projectTemplate) =>
        projectTemplate.uid === this.form.controls['template'].value
    )[0].board.assignedTasks;
  }

  getBoards() {
    return {
      assignedTasks:
        this.mode === 'add' && this.form.controls['template'].value !== 'none'
          ? this.getSelectedProjectTemplate()
          : [],
      inProgressTasks: [],
      doneTasks: [],
    };
  }

  fetchAllUsers() {
    return this.firestoreService.collectionSnapshot$('users').pipe(
      first(),
      tap((userDocs) => {
        this.dropdownList = userDocs.map((userDoc) => ({
          userUid: userDoc['uid'],
          username: userDoc['displayName'],
        }));
      })
    );
  }

  fetchProjectsTemplates() {
    return this.firestoreService.collectionSnapshot$('projectsTemplates').pipe(
      first(),
      tap((projectTemplates: any) => {
        this.projectTemplates = projectTemplates;
      })
    );
  }

  fetchCurrentProject() {
    this.firestoreService
      .getDocument<Project>('projects', this.projectUid!)
      .then((project) => {
        const {
          title,
          description,
          dueDate: _dueDate,
          assignedUsers: usersUid,
        } = project.data;

        const notFormatedDueDate = _dueDate.toDate();
        const formatedDueDate = this.getFormatedDueDate(notFormatedDueDate);
        const assignedUsers = this.getAssignedUsers(usersUid);

        this.form.controls['title'].setValue(title);
        this.form.controls['description'].setValue(description);
        this.form.controls['dueDate'].setValue(formatedDueDate);
        this.form.controls['selectedUsers'].setValue(assignedUsers);
      });
  }

  handleSuccess() {
    this.toastService.success('Dodano nowy projekt');
    this.router.navigate(['/projects']);
  }

  handleError(error: any) {
    this.toastService.error(error.message);
  }

  async postProject(project: any) {
    project.boards = this.getBoards();
    await this.projectsService.createProject(project);
  }

  async updateProject(project: any) {
    await this.firestoreService.updateDocument(
      'projects',
      this.projectUid!,
      project
    );
  }

  async onSubmit() {
    this.loading = true;

    const project: ProjectToAdd = {
      title: this.title.value,
      description: this.description.value,
      dueDate: this.firestoreService.getTimestamp(new Date(this.dueDate.value)),
      assignedUsers: this.getAssignedUsersUid(this.selectedUsers.value),
    };

    try {
      switch (this.mode) {
        case 'add':
          await this.postProject(project);
          break;

        case 'edit':
          await this.updateProject(project);
          break;
      }
      this.handleSuccess();
    } catch (error) {
      this.handleError(error);
    }

    this.loading = false;
  }
}
