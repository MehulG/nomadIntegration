import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubContentComponent } from './github-content.component';

describe('GithubContentComponent', () => {
  let component: GithubContentComponent;
  let fixture: ComponentFixture<GithubContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
