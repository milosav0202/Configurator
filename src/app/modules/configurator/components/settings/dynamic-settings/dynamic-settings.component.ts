import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  exportAs: 'dynamic-settings',
  selector: 'app-dynamic-settings',
  template: `
      <ng-container *ngFor="let element of elements;" dynamicSettingsField [element]="element" [color]=" color" (productChangeEvent)="productChangeEvent.emit($event)">
      </ng-container>
  `,
  styles: []
})
export class DynamicSettingsComponent implements OnInit {
  @Input() color: string;
  @Input() elements = [];
  @Output() productChangeEvent: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {

  }
}
