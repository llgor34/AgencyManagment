import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ButtonComponent } from '../components/button/button.component';
import { FormComponent } from '../components/form/form.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { PlusIconComponent } from '../components/plus-icon/plus-icon.component';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { GetRolesPipe } from '../pipes/get-roles.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

const declarations = [
  LoadingSpinnerComponent,
  GetRolesPipe,
  PlusIconComponent,
  ButtonComponent,
  ResetPasswordComponent,
  FormComponent,
];

const modules = [
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  NgMultiSelectDropDownModule,
  DragDropModule,
  MatDialogModule,
  MatFormFieldModule,
  MatTabsModule,
  MatExpansionModule,
];

@NgModule({
  imports: [...modules, RouterModule],
  declarations: [...declarations],
  exports: [...declarations, ...modules],
})
export class SharedModule {}
