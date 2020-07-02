import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitexpenseComponent } from './splitexpense.component';

describe('SplitexpenseComponent', () => {
  let component: SplitexpenseComponent;
  let fixture: ComponentFixture<SplitexpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitexpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
