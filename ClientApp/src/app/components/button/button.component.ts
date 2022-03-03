import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      type="button"
      class="btn btn-outline-primary btn-sm"
      [ngClass]="submit ? 'mb-2' : ''"
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
