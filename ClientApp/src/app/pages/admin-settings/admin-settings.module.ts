import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminSettingsRoutingModule } from './admin-settings-routing.module';
import { AdminSettingsComponent } from './admin-settings.component';
import { ManageProjectTemplateComponent } from './manage-project-template/manage-project-template.component';

@NgModule({
  declarations: [AdminSettingsComponent, ManageProjectTemplateComponent],
  imports: [CommonModule, SharedModule, AdminSettingsRoutingModule],
})
export class AdminSettingsModule {}
