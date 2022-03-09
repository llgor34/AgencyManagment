import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  loading = false;
  form: FormGroup;
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.initializeForm();
    this.loading = false;
  }

  initializeForm() {
    this.dropdownList = [
      { userUid: 'adasdsa', username: 'Mumbai' },
      { userUid: '2asdas', username: 'Bangaluru' },
      { userUid: '31safda', username: 'Pune' },
      { userUid: '41312312asd', username: 'Navsari' },
      { userUid: 'Adasda', username: 'New Delhi' },
    ];
    this.selectedItems = [];
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
      description: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', Validators.required],
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

  get content() {
    return this.form.controls['content'];
  }

  get dueDate() {
    return this.form.controls['dueDate'];
  }

  get selectedUsers() {
    return this.form.controls['selectedUsers'];
  }

  onSubmit() {
    console.log(this.form);
  }
}
