import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendOrderComponent } from './dialog-send-order.component';

describe('DialogSendOrderComponent', () => {
  let component: DialogSendOrderComponent;
  let fixture: ComponentFixture<DialogSendOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSendOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
