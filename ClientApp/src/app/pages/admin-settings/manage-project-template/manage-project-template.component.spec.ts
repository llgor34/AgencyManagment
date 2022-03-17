import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProjectTemplateComponent } from './manage-project-template.component';

describe('ManageProjectTemplateComponent', () => {
  let component: ManageProjectTemplateComponent;
  let fixture: ComponentFixture<ManageProjectTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProjectTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
