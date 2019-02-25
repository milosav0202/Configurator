import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabletabViewComponent } from './cabletab-view.component';

describe('CabletabViewComponent', () => {
  let component: CabletabViewComponent;
  let fixture: ComponentFixture<CabletabViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabletabViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabletabViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
