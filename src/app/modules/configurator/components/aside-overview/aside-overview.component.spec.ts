import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideOverviewComponent } from './aside-overview.component';

describe('AsideOverviewComponent', () => {
  let component: AsideOverviewComponent;
  let fixture: ComponentFixture<AsideOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
