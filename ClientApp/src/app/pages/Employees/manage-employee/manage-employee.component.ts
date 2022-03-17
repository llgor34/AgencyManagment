import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserDoc } from 'src/app/models/UserDoc.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.css'],
})
export class ManageEmployeeComponent implements OnInit {
  loading = false;
  form: FormGroup;
  userDoc: UserDoc;

  constructor(
    private firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(new RegExp('^\\d{9}$'))],
      ],
      roles: this.fb.array([]),
    });

    this.firestoreService
      .getDocument('users', this.route.snapshot.params['uid'])
      .then((res: UserDoc) => {
        this.userDoc = res;

        for (const key in res.data.roles) {
          this.rolesControl.push(new FormControl(res.data.roles[key]));
        }

        this.form.controls['username'].setValue(res.data.displayName);
        this.form.controls['email'].setValue(res.data.email);
        this.form.controls['phoneNumber'].setValue(res.data.phoneNumber);

        this.loading = false;
      });
  }

  get rolesControl() {
    return this.form.controls['roles'] as FormArray;
  }

  get usernameControl() {
    return this.form.controls['username'];
  }

  get emailControl() {
    return this.form.controls['email'];
  }

  get phoneNumberControl() {
    return this.form.controls['phoneNumber'];
  }

  getRole(idx: number) {
    return Object.keys(this.userDoc.data.roles)[idx];
  }

  async onSubmit() {
    this.loading = true;

    const obj: any = {
      displayName: this.usernameControl.value,
      email: this.emailControl.value,
      phoneNumber: this.phoneNumberControl.value,
      roles: {},
    };

    this.rolesControl.controls.forEach((control, index) => {
      obj.roles[this.getRole(index)] = control.value;
    });

    try {
      await this.firestoreService.updateDocument(
        'users',
        this.userDoc.uid,
        obj
      );
      this.toastService.success('Zaktualizowano dane!');
      this.router.navigate(['/manage-employees']);
    } catch (error: any) {
      this.toastService.error(error.message);
      this.form.reset();
    }
    this.loading = false;
  }
}
