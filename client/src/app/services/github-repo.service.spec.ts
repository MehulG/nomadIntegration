import { TestBed } from '@angular/core/testing';

import { GithubRepoService } from './github-repo.service';

describe('GithubRepoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GithubRepoService = TestBed.get(GithubRepoService);
    expect(service).toBeTruthy();
  });
});
