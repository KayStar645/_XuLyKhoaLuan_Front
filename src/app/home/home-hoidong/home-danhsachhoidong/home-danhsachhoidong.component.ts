import { Component, OnInit } from '@angular/core';
import { HoiDongVT } from 'src/app/models/VirtualModel/HoiDongVTModel';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { hoiDongService } from 'src/app/services/hoiDong.service';
import { shareService } from 'src/app/services/share.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-danhsachhoidong',
  templateUrl: './home-danhsachhoidong.component.html',
  styleUrls: ['./home-danhsachhoidong.component.scss'],
})
export class HomeDanhsachhoidongComponent implements OnInit {
  hoiDongs: HoiDongVT[] = [];
  isTbm = false;

  constructor(
    private hoiDongService: hoiDongService,
    private shareService: shareService,
    private router: Router
  ) {}
  async ngOnInit(): Promise<void> {
    if (HomeMainComponent.maBm) {
      this.isTbm = true;
      this.hoiDongs = await this.hoiDongService.GetHoidongsByBomon(
        HomeMainComponent.maBm
      );
    } else {
      this.hoiDongs = await this.hoiDongService.GetHoidongsByGiangvien(
        HomeMainComponent.maGV
      );
    }
  }

  onUpdate(maHd: string) {
    let hoiDong = this.hoiDongs.find((h) => h.maHD == maHd);

    this.router.navigateByUrl(
      '/home/hoi-dong/form-hoidong',
      {
        state: {
          isAdd: false,
          hoiDong: hoiDong
        }
      }
    );
  }

  thoiGianBaoVe(start: string, end: string): string {
    let day = format(new Date(start), 'dd/MM/yyyy');
    let s = start.slice(11, 16);
    let e = end.slice(11, 16);

    return s + '-' + e + ' Ngày ' + day;
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
