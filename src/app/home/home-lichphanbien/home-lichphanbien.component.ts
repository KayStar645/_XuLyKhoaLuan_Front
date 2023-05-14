import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { HomeMainComponent } from '../home-main/home-main.component';

@Component({
  selector: 'app-home-lichphanbien',
  templateUrl: './home-lichphanbien.component.html',
})
export class HomeLichphanbienComponent implements OnInit {
  lichPhanBiens: LichPhanBien[] = [];
  maGv = '';

  constructor(private lichPhanVienService: lichPhanBienService) {}

  async ngOnInit(): Promise<void> {
    this.maGv = HomeMainComponent.maGV;
    await this.getShedule();
  }

  async getShedule() {
    this.lichPhanBiens =
      await this.lichPhanVienService.GetLichPhanBienByGvAsync(
        HomeMainComponent.maGV
      );
  }
}
