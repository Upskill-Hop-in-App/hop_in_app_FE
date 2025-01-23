import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentLiftComponent } from './current-lift.component';

describe('CurrentLiftComponent', () => {
  let component: CurrentLiftComponent;
  let fixture: ComponentFixture<CurrentLiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentLiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentLiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
