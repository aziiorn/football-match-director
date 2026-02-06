import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetComponentComponent } from './bet.component';

describe('BetComponentComponent', () => {
  let component: BetComponentComponent;
  let fixture: ComponentFixture<BetComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
