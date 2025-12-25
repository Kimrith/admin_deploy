import { TestBed } from '@angular/core/testing';

import { Ath } from './ath';

describe('Ath', () => {
  let service: Ath;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ath);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
