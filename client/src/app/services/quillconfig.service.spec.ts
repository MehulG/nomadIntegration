import { TestBed } from '@angular/core/testing';

import { QuillConfigService } from './quillconfig.service';

describe('QuillconfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuillConfigService = TestBed.get(QuillConfigService);
    expect(service).toBeTruthy();
  });
});
