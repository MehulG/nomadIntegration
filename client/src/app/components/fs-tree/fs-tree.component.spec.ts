import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsTreeComponent } from './fs-tree.component';

describe('FsTreeComponent', () => {
  let component: FsTreeComponent;
  let fixture: ComponentFixture<FsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
