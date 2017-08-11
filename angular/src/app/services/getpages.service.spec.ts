import { TestBed, inject } from '@angular/core/testing';

import { GetpagesService } from './getpages.service';

describe('GetpagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetpagesService]
    });
  });

  it('should be created', inject([GetpagesService], (service: GetpagesService) => {
    expect(service).toBeTruthy();
  }));
});
