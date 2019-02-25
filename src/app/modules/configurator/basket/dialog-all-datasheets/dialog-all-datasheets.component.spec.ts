import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAllDatasheetsComponent } from './dialog-all-datasheets.component';

describe('DialogAllDatasheetsComponent', () => {
  let component: DialogAllDatasheetsComponent;
  let fixture: ComponentFixture<DialogAllDatasheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAllDatasheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAllDatasheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
