import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotjumpblackComponent } from './dotjumpblack.component';

describe('DotjumpblackComponent', () => {
  let component: DotjumpblackComponent;
  let fixture: ComponentFixture<DotjumpblackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotjumpblackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotjumpblackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
