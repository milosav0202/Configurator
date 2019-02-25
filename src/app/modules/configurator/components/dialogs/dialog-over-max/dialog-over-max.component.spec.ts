import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOverMaxComponent } from './dialog-over-max.component';

describe('DialogOverMaxComponent', () => {
  let component: DialogOverMaxComponent;
  let fixture: ComponentFixture<DialogOverMaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOverMaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOverMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
