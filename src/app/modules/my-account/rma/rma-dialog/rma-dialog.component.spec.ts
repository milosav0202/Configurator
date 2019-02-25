import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmaDialogComponent } from './rma.component';

describe('RmaComponent', () => {
  let component: RmaDialogComponent;
  let fixture: ComponentFixture<RmaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
