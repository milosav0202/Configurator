import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscViewComponent } from './misc-view.component';

describe('MiscViewComponent', () => {
  let component: MiscViewComponent;
  let fixture: ComponentFixture<MiscViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
