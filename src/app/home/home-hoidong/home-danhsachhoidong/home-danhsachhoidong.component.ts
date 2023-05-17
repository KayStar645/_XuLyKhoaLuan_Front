import { Component, OnInit } from '@angular/core';
import { HoiDongVT } from 'src/app/models/VirtualModel/HoiDongVTModel';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { hoiDongService } from 'src/app/services/hoiDong.service';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-home-danhsachhoidong',
  templateUrl: './home-danhsachhoidong.component.html',
  styleUrls: ['./home-danhsachhoidong.component.scss'],
})
export class HomeDanhsachhoidongComponent implements OnInit {
  hoiDongs: HoiDongVT[] = [];

  constructor(
    private hoiDongService: hoiDongService,
    private shareService: shareService
  ) {}
  async ngOnInit(): Promise<void> {
    this.hoiDongs = await this.hoiDongService.GetHoidongsByGiangvien(
      HomeMainComponent.maGV
    );
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
