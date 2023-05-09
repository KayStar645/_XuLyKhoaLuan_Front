import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home.component';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import { HomeMainComponent } from '../home-main/home-main.component';

@Component({
  selector: 'app-home-lichphanbien',
  templateUrl: './home-lichphanbien.component.html',
  styleUrls: ['./home-lichphanbien.component.scss'],
})
export class HomeLichphanbienComponent implements OnInit {
  lichPhanBiens: LichPhanBien[] = [];

  constructor(
    private lichPhanVienService: lichPhanBienService,
    private giangVienService: giangVienService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getShedule();
  }

  async getShedule() {
    this.lichPhanBiens =
      await this.lichPhanVienService.GetLichPhanBienByGvAsync(
        HomeMainComponent.maGV
      );
  }
}
