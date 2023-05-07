import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home.component';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';

@Component({
  selector: 'app-home-lichphanbien',
  templateUrl: './home-lichphanbien.component.html',
  styleUrls: ['./home-lichphanbien.component.scss'],
})
export class HomeLichphanbienComponent implements OnInit {
  lichPhanBiens: LichPhanBien[] = [];
  giangVien!: GiangVien;

  constructor(
    private lichPhanVienService: lichPhanBienService,
    private giangVienService: giangVienService
  ) {}

  async ngOnInit(): Promise<void> {
    this.giangVien = await this.giangVienService.getById(
      '' + localStorage.getItem('Id')?.toString()
    );

    await this.getShedule();
  }

  async getShedule() {
    await this.lichPhanVienService
      .GetAllTraoDoiMotCongViec(this.giangVien.maGv)
      .then((res) => {
        this.lichPhanBiens = res;
      });
  }
}
