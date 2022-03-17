import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Project } from 'src/app/models/Projects';
import { ProjectsService } from 'src/app/services/projects.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProjectTemplate } from 'src/app/models/ProjectTemplate.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  @Input('mode') mode: 'add' | 'edit';

  private subs: Subscription[] = [];
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
    const userSub = this.firestoreService
      .collectionSnapshot$('users')
      .subscribe((userDocs) => {
        this.dropdownList = userDocs.map((userDoc) => ({
          userUid: userDoc['uid'],
          username: userDoc['displayName'],
        }));

        this.projectUid = this.route.snapshot.params['uid'];
        this.initializeForm();
        this.loading = false;
      });
    this.subs.push(userSub);

    if (this.mode === 'add') {
      const projectTemplateSub = this.firestoreService
        .collectionSnapshot$('projectsTemplates')
        .subscribe((projectTemplates: any) => {
          this.projectTemplates = projectTemplates;
        });
      this.subs.push(projectTemplateSub);
    }
  }

  ngOnDestroy(): void {
    for (let sub of this.subs) {
      sub.unsubscribe();
    }
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

  async onSubmitNewProject() {
    this.loading = true;
    try {
      await this.projectsService.createProject({
        title: this.title.value,
        description: this.description.value,
        dueDate: new Date(this.dueDate.value),
        assignedUsers: this.selectedUsers.value.map(
          (selectedUser: any) => selectedUser['userUid']
        ),
        boards: {
          assignedTasks:
            this.mode === 'add' &&
            this.form.controls['template'].value !== 'none'
              ? this.projectTemplates.filter(
                  (projectTemplate) =>
                    projectTemplate.uid === this.form.controls['template'].value
                )[0].board.assignedTasks
              : [],
          inProgressTasks: [],
          doneTasks: [],
        },
      });
      this.toastService.success('Dodano nowy projekt');
      this.router.navigate(['/projects']);
    } catch (error: any) {
      this.toastService.error(error.message);
    }

    this.loading = false;
  }

  async onSubmitExistingProject() {
    this.loading = true;

    try {
      await this.firestoreService.updateDocument('projects', this.projectUid!, {
        title: this.title.value,
        description: this.description.value,
        dueDate: this.firestoreService.getTimestamp(
          new Date(this.dueDate.value)
        ),
        assignedUsers: this.selectedUsers.value.map(
          (selectedUser: any) => selectedUser['userUid']
        ),
      });

      this.toastService.success('Zaktualizowano projekt!');
      this.router.navigate(['/projects']);
    } catch (error: any) {
      this.toastService.error(error.message);
    }

    this.loading = false;
  }
}
