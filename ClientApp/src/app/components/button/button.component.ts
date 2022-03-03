import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      type="button"
      class="btn btn-sm"
      [ngClass]="{
        'mb-2': submit,
        'btn-outline-primary': color === 'primary' && !submit,
        'btn-primary': color === 'primary' && submit,
        'btn-outline-danger': color === 'secondary' && !submit,
        'btn-danger': color === 'secondary' && submit
      }"
      (click)="onSubmit()"
    >
      <ng-content *ngIf="!submit; else confirm"></ng-content>
      <ng-template #confirm>Potwierdź</ng-template>
    </button>
    <button
      type="button"
      class="btn btn-outline-danger btn-sm"
      (click)="onCancel()"
      *ngIf="submit"
    >
      Anuluj
    </button>
  `,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Output() submitted = new EventEmitter<void>();
  @Input() color: 'primary' | 'secondary' = 'primary';
  submit = false;

  onSubmit() {
    if (!this.submit) {
      this.submit = true;
      return;
    }
    this.submitted.emit();
    this.submit = false;
  }

  onCancel() {
    this.submit = false;
  }

  constructor() {}
}
