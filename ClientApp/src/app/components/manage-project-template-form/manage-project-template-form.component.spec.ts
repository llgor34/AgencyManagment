import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectTemplateFormComponent } from './manage-project-template-form.component';

describe('ManageProjectTemplateFormComponent', () => {
  let component: ManageProjectTemplateFormComponent;
  let fixture: ComponentFixture<ManageProjectTemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProjectTemplateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectTemplateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
