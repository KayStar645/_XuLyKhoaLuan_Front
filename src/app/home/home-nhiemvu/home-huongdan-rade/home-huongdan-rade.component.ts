import { Component, OnInit } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { PhanBien } from 'src/app/models/PhanBien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { huongDanService } from 'src/app/services/huongDan.service';
import { phanBienService } from 'src/app/services/phanBien.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';

@Component({
  selector: 'app-home-huongdan-rade',
  templateUrl: './home-huongdan-rade.component.html',
  styleUrls: ['./home-huongdan-rade.component.scss'],
})
export class HomeHuongdanRadeComponent implements OnInit {
  selectedGVPB: any[] = [];
  GVPBInputConfig: any = {};
  GVHDInputConfig: any = {};
  deTais: DeTai[] = [];
  sinhViens: any[] = [];
  rowSpans: any[] = [];
  maDt = '';

  constructor(
    private deTaiService: deTaiService,
    private sinhVienService: sinhVienService,
    private phanBienService: phanBienService,
    private huongDanService: huongDanService,
    private giangVienService: giangVienService
  ) {}

  async ngOnInit(): Promise<void> {
    let giangViens1 = await this.giangVienService.getAll();
    let giangViens2 = await this.giangVienService.getAll();

    this.GVPBInputConfig.data = giangViens1;
    this.GVPBInputConfig.keyWord = 'tenGv';
    this.GVPBInputConfig.selectedItem = [];

    this.GVHDInputConfig.data = giangViens2;
    this.GVHDInputConfig.keyWord = 'tenGv';
    this.GVHDInputConfig.selectedItem = [];

    await this.deTaiService.getAll().then(async (data) => {
      this.deTais = data;

      for (const dt of data) {
        await this.sinhVienService
          .getSinhvienByDetai(dt.maDT)
          .then(async (sv: any[]) => {
            if (sv.length > 0) {
              sv[0].maDT = dt.maDT;

              sv[0].giangVienHD = await this.huongDanService
                .getGiangvienByDetai(dt.maDT)
                .then();

              sv[0].giangVienPB = await this.phanBienService
                .getGiangvienByDetai(dt.maDT)
                .then();

              sv[sv.length - 1].isLast = true;

              this.sinhViens = [...this.sinhViens, ...sv];

              this.rowSpans.push({
                maDT: dt.maDT,
                span: sv.length,
              });
            }
          });
      }
    });
  }

  onUpdate(event: any) {
    let id = event.target.dataset.index;
    let deTai = this.sinhViens.find((t) => t.maDT === id);

    this.maDt = id;

    this.GVHDInputConfig.selectedItem = deTai.giangVienHD;

    this.GVHDInputConfig.selectedItem.forEach((gv: any) => {
      let index = this.GVPBInputConfig.data.findIndex(
        (t: any) => t.maGv === gv.maGv
      );

      if (index > -1) {
        this.GVPBInputConfig.data.splice(index, 1);
      }
    });

    this.GVPBInputConfig.selectedItem = deTai.giangVienPB;

    deTai.giangVienPB.forEach((gv: any) => {
      let index = this.GVHDInputConfig.data.findIndex(
        (t: any) => t.maGv === gv.maGv
      );

      if (index > -1) {
        this.GVHDInputConfig.data.splice(index, 1);
      }
    });
  }

  async onSelectGVHD(event: any) {
    let hd = new HuongDan();
    let index = this.GVPBInputConfig.data.findIndex(
      (t: any) => t.maGv === event.maGv
    );

    hd.init(event.maGv, this.maDt, true);
    this.GVPBInputConfig.data.splice(index, 1);

    await this.huongDanService.add(hd);
  }

  async onUnSelectGVHD(event: any) {
    this.GVPBInputConfig.data.push(event);
    await this.huongDanService.delete(event.maGv, this.maDt);
  }

  async onSelectGVPB(event: any) {
    let pb = new PhanBien();
    let index = this.GVHDInputConfig.data.findIndex(
      (t: any) => t.maGv === event.maGv
    );

    pb.init(event.maGv, this.maDt, true);
    this.GVHDInputConfig.data.splice(index, 1);

    await this.phanBienService.add(pb);
  }

  async onUnSelectGVPB(event: any) {
    this.GVHDInputConfig.data.push(event);
    await this.phanBienService.delete(event.maGv, this.maDt);
  }

  getRowSpan(maDT: string) {
    return this.rowSpans.find((t) => t.maDT === maDT).span!;
  }

  getDeTaiByID(maDT: string) {
    return this.deTais.find((t) => t.maDT === maDT)?.tenDT!;
  }
}
