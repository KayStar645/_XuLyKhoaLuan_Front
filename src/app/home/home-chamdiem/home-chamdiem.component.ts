import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { deTaiDiemService } from './../../services/NghiepVu/detaidiem.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';
import { HomeMainComponent } from '../home-main/home-main.component';
import { DiemSoVT } from 'src/app/models/VirtualModel/DiemSoVTModel';
import { shareService } from 'src/app/services/share.service';
import { SinhVienVT } from 'src/app/models/VirtualModel/SinhVienVTModel';

@Component({
  selector: 'app-home-chamdiem',
  templateUrl: './home-chamdiem.component.html',
  styleUrls: ['./home-chamdiem.component.scss'],
})
export class HomeChamdiemComponent {
  data: DeTaiDiemVT[] = [];
  len = 0;
  maGv = '';

  constructor(
    private titleService: Title,
    private deTaiDiemService: deTaiDiemService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Chấm điểm đề tài');
    this.maGv = HomeMainComponent.maGV;
    this.data = await this.deTaiDiemService.GetDanhSachDiemByGv(this.maGv);
  }

  async onChangeDiem(event: any, diemSv: DiemSoVT, deTai: DeTaiDiemVT, sv: SinhVienVT) {
    let newDiem = event.target.value;
    if (newDiem != '') {
      await this.deTaiDiemService.ChamDiemSv(
        this.maGv,
        deTai.maDT,
        sv.maSV,
        shareService.namHoc,
        shareService.dot,
        diemSv.nguoiCham,
        newDiem
      );
    }
  }
}
