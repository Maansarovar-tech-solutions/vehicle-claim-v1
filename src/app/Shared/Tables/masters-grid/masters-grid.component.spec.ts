import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastersGridComponent } from './masters-grid.component';

describe('MastersGridComponent', () => {
  let component: MastersGridComponent;
  let fixture: ComponentFixture<MastersGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastersGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MastersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
