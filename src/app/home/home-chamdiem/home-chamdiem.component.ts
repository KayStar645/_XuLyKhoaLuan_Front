import { WebsocketService } from 'src/app/services/Websocket.service';
import { phanBienService } from './../../services/phanBien.service';
import { huongDanService } from './../../services/huongDan.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { deTaiDiemService } from './../../services/NghiepVu/detaidiem.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';
import { HomeMainComponent } from '../home-main/home-main.component';
import { DiemSoVT } from 'src/app/models/VirtualModel/DiemSoVTModel';
import { shareService } from 'src/app/services/share.service';
import { SinhVienVT } from 'src/app/models/VirtualModel/SinhVienVTModel';
import { Option } from 'src/assets/utils';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { PhanBien } from 'src/app/models/PhanBien.model';

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
    private deTaiDiemService: deTaiDiemService,
    private huongDanService: huongDanService,
    private phanBienService: phanBienService,
    private WebsocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Chấm điểm đề tài');
    this.maGv = HomeMainComponent.maGV;
    this.data = await this.deTaiDiemService.GetDanhSachDiemByGv(this.maGv);
    
    this.WebsocketService.startConnection();
    this.WebsocketService.receiveFromDeTaiDiem(async (dataChange: boolean) => {
      this.data = await this.deTaiDiemService.GetDanhSachDiemByGv(this.maGv);
    });
  }

  async onChangeDiem(
    event: any,
    diemSv: DiemSoVT,
    deTai: DeTaiDiemVT,
    sv: SinhVienVT
  ) {
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

  onConfirm(maDt: string) {
    let option = new Option('#confirm');
    option.show('warning', () => {});

    option.cancel(() => {
      
    });

    option.agree(() => {
      document.documentElement.classList.remove('no-scroll');
      
      for (let dt of this.data) {
        if (dt.maDT == maDt) {
          for (let gv of dt.gvhDs) {
            if (gv.maGv == this.maGv) {
              let hd = new HuongDan();
              hd.init(this.maGv, maDt, true);
              this.huongDanService.update(hd);
              this.WebsocketService.sendForDeTaiDiem(true);
              return;
            }
          }

          for (let gv of dt.gvpBs) {
            if (gv.maGv == this.maGv) {
              let pb = new PhanBien();
              pb.init(this.maGv, maDt, true);
              this.phanBienService.update(pb);
              this.WebsocketService.sendForDeTaiDiem(true);
              return;
            }
          }
        }
      }
    });
  }

  isDuaRaHoiDong(maDt: string) {
    for(let dt of this.data) {
      if (dt.maDT == maDt) {
        for(let gv of dt.gvhDs) {
          if (gv.maGv == this.maGv) {
            return gv.duaRaHoiDong == 0 ? false : true;
          }
        }

        for (let gv of dt.gvpBs) {
          if (gv.maGv == this.maGv) {
            return gv.duaRaHoiDong == 0 ? false : true;
          }
        }
      }
    }
    return true;
  }
}
