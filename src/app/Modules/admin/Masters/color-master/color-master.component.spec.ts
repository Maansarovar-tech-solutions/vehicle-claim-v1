import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMasterComponent } from './color-master.component';

describe('ColorMasterComponent', () => {
  let component: ColorMasterComponent;
  let fixture: ComponentFixture<ColorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
