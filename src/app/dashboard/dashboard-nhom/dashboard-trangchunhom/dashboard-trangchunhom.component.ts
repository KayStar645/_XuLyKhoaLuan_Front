import { Component } from '@angular/core';
import { CongViec } from 'src/app/models/CongViec.model';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { congViecService } from 'src/app/services/congViec.service';
import { shareService } from 'src/app/services/share.service';
import { DashboardComponent } from '../../dashboard.component';
import { giangVienService } from 'src/app/services/giangVien.service';

@Component({
  selector: 'app-dashboard-trangchunhom',
  templateUrl: './dashboard-trangchunhom.component.html',
  styleUrls: ['./dashboard-trangchunhom.component.scss'],
})
export class DashboardTrangchunhomComponent {
  lstCV: CongViec[] = [];
  selectedTB: string = 'adsad';
  root: CongViec[] = [];
  lineTB = new NhiemVu();
  elementOld: any;
  nearTimeOutMS: any[] = [];
  isSignUpDeTai = false;

  constructor(
    private congViecService: congViecService,
    private shareService: shareService,
    private giangVienService: giangVienService,
  ) {}

  async ngOnInit() {
    await this.getAllNhiemVu();
    this.isSignUpDeTai = DashboardComponent.isSignUpDeTai;
  }

  async getAllNhiemVu() {
    if(await this.congViecService.isHaveCongViecForGroup(DashboardComponent.maNhom)){
      this.lstCV = await this.congViecService.getAllCongViecForGroup(DashboardComponent.maNhom);
      this.adjustListCv();
    }
  }

  async adjustListCv(){
    for(let i = 0 ; i < this.lstCV.length ; i++){
      this.lstCV[i].maGv = (await this.giangVienService.getById(this.lstCV[i].maGv)).tenGv;
    }
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
