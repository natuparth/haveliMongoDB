import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLogoComponent } from './profile-logo.component';

describe('ProfileLogoComponent', () => {
  let component: ProfileLogoComponent;
  let fixture: ComponentFixture<ProfileLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
