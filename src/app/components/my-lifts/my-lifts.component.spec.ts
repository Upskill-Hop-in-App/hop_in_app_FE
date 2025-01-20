import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLiftsComponent } from './my-lifts.component';

describe('MyLiftsComponent', () => {
  let component: MyLiftsComponent;
  let fixture: ComponentFixture<MyLiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyLiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
