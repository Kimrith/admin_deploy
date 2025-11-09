import { TestBed } from '@angular/core/testing';

import { Cetecory } from './cetecory';

describe('Cetecory', () => {
  let service: Cetecory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cetecory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
