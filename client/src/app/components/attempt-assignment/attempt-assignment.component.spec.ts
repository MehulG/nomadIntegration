import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAssignmentComponent } from './attempt-assignment.component';

describe('AttemptAssignmentComponent', () => {
  let component: AttemptAssignmentComponent;
  let fixture: ComponentFixture<AttemptAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttemptAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
