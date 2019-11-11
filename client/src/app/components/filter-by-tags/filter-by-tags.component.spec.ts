import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByTagsComponent } from './filter-by-tags.component';

describe('FilterByTagsComponent', () => {
  let component: FilterByTagsComponent;
  let fixture: ComponentFixture<FilterByTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterByTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterByTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
