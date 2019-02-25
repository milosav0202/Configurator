import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowAtComponent } from './dialog-show-at.component';

describe('DialogShowAtComponent', () => {
  let component: DialogShowAtComponent;
  let fixture: ComponentFixture<DialogShowAtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogShowAtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogShowAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
