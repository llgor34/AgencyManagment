import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
})
export class ProjectFormComponent implements OnInit {
  @Input('mode') mode: 'add' | 'edit';

  private usersSub: Subscription;
  loading = false;
  form: FormGroup;
  dropdownList: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  projectUid: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private projectsService: ProjectsService,
    private auth: Auth,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.usersSub = this.firestoreService
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
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  initializeForm() {
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

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      selectedUsers: [[], this.minOneUser],
    });

    if (this.mode === 'edit') {
      this.firestoreService
        .getDocument<Project>('projects', this.projectUid!)
        .then((res) => {
          const {
            title,
            description,
            dueDate: _dueDate,
            assignedUsers: _assignedUsers,
          } = res.data;

          const date = _dueDate.toDate();
          const dueDate = `${date.getFullYear()}-${
            date.getMonth() + 1 < 10
              ? '0' + (date.getMonth() + 1)
              : date.getMonth() + 1
          }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;

          const assignedUsers: any[] = [];
          for (let user of _assignedUsers) {
            assignedUsers.push(
              this.dropdownList.filter(
                (userList) => userList.userUid === user
              )[0]
            );
          }

          this.form.controls['title'].setValue(title);
          this.form.controls['description'].setValue(description);
          this.form.controls['dueDate'].setValue(dueDate);
          this.form.controls['selectedUsers'].setValue(assignedUsers);
        });
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
