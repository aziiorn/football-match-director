import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOddsComponent } from './match-odds.component';

describe('MatchOddsComponent', () => {
  let component: MatchOddsComponent;
  let fixture: ComponentFixture<MatchOddsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchOddsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchOddsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
