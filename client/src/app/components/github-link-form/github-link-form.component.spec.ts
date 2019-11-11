import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GithubLinkFormComponent } from './github-link-form.component';

describe('GithubLinkFormComponent', () => {
  let component: GithubLinkFormComponent;
  let fixture: ComponentFixture<GithubLinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GithubLinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubLinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
