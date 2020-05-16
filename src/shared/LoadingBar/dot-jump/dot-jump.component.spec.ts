import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotJumpComponent } from './dot-jump.component';

describe('DotJumpComponent', () => {
  let component: DotJumpComponent;
  let fixture: ComponentFixture<DotJumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotJumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotJumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
