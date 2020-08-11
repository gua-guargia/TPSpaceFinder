import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailspagePage } from './detailspage.page';

describe('DetailspagePage', () => {
  let component: DetailspagePage;
  let fixture: ComponentFixture<DetailspagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailspagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailspagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
