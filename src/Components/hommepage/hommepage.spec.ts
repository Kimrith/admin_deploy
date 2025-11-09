import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hommepage } from './hommepage';

describe('Hommepage', () => {
  let component: Hommepage;
  let fixture: ComponentFixture<Hommepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hommepage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hommepage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
