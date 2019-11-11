import { TestBed } from '@angular/core/testing';

import { AttemptAssignmentService } from './attempt-assignment.service';

describe('AttemptAssignmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttemptAssignmentService = TestBed.get(AttemptAssignmentService);
    expect(service).toBeTruthy();
  });
});
