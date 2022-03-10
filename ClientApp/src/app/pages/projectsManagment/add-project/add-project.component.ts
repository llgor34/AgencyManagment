import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Project } from 'src/app/shared/models/Projects';
import { ProjectsService } from 'src/app/shared/projects.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  private usersSub: Subscription;
  loading = false;
  form: FormGroup;
  dropdownList: any[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private projectsService: ProjectsService,
    private auth: Auth,
    private toastService: ToastService,
    private router: Router
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
      });

    this.initializeForm();
    this.loading = false;
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

  async onSubmit() {
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
}
