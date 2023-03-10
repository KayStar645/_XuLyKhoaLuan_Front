import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardThongbaoComponent } from './dashboard-thongbao.component';

describe('DashboardThongbaoComponent', () => {
  let component: DashboardThongbaoComponent;
  let fixture: ComponentFixture<DashboardThongbaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardThongbaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardThongbaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
