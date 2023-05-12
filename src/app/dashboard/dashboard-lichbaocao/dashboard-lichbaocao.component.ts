import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main.component';

@Component({
  selector: 'app-dashboard-lichbaocao',
  templateUrl: './dashboard-lichbaocao.component.html',
})
export class DashboardLichbaocaoComponent implements OnInit {
  lichPhanBiens: LichPhanBien[] = [];

  constructor(
    private lichPhanVienService: lichPhanBienService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getShedule();
  }

  async getShedule() {
    this.lichPhanBiens =
      await this.lichPhanVienService.GetLichPhanBienBySvAsync(
        DashboardMainComponent.maSV
      );
  }

  onSelectType() {}
}


