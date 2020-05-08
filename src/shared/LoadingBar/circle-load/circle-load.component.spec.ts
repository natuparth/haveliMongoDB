import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleLoadComponent } from './circle-load.component';

describe('CircleLoadComponent', () => {
  let component: CircleLoadComponent;
  let fixture: ComponentFixture<CircleLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
