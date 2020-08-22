import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PasswordResetpagePage } from './password-resetpage.page';

describe('PasswordResetpagePage', () => {
  let component: PasswordResetpagePage;
  let fixture: ComponentFixture<PasswordResetpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
