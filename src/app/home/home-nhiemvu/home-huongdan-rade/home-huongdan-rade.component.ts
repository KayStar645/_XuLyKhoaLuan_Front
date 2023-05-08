import { HdCham } from './../../../models/HdCham.model';
import { pbChamService } from './../../../services/pbCham.service';
import { hdChamService } from './../../../services/hdCham.service';
import { Component, OnInit } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { PhanBien } from 'src/app/models/PhanBien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { huongDanService } from 'src/app/services/huongDan.service';
import { phanBienService } from 'src/app/services/phanBien.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { shareService } from 'src/app/services/share.service';
import { PbCham } from 'src/app/models/PbCham.model';

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
  restDeTais: any[] = [];
  sinhViens: any[] = [];
  rowSpans: any[] = [];
  maDt = '';
  isTruongBM: boolean = false;

  constructor(
    private deTaiService: deTaiService,
    private sinhVienService: sinhVienService,
    private phanBienService: phanBienService,
    private huongDanService: huongDanService,
    private giangVienService: giangVienService,
    private hdChamService: hdChamService,
    private pbChamService: pbChamService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;

    let giangViens1 = await this.giangVienService.getAll();
    let giangViens2 = await this.giangVienService.getAll();

    this.GVPBInputConfig.data = giangViens1;
    this.GVPBInputConfig.keyWord = 'tenGv';
    this.GVPBInputConfig.selectedItem = [];

    this.GVHDInputConfig.data = giangViens2;
    this.GVHDInputConfig.keyWord = 'tenGv';
    this.GVHDInputConfig.selectedItem = [];

    await this.getAllDetai();
  }

  async getAllDetai() {
    // Chỉ lấy danh sách đề tài đã được duyệt của bộ môn mình
    if (this.isTruongBM) {
      this.restDeTais = await this.deTaiService.getDetaiByBomonDot(
        HomeMainComponent.maBm,
        shareService.namHoc,
        shareService.dot,
        true
      );

      await this.deTaiService
        .getDetaiByBomonDot(
          HomeMainComponent.maBm,
          shareService.namHoc,
          shareService.dot,
          true
        )
        .then(async (data) => {
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

      this.sinhViens.forEach((sv) => {
        if (sv.maDT) {
          let index = this.restDeTais.findIndex((t) => t.maDT === sv.maDT);

          this.restDeTais.splice(index, 1);
        }
      });

      this.restDeTais.forEach(async (dt) => {
        dt.giangVienHD = await this.huongDanService.getGiangvienByDetai(
          dt.maDT
        );
        dt.giangVienPB = await this.phanBienService.getGiangvienByDetai(
          dt.maDT
        );
      });
    } else {
      await this.deTaiService
        .GetDetaiByHuongdanOfGiangvienDotdk(
          HomeMainComponent.maGV,
          shareService.namHoc,
          shareService.dot
        )
        .then(async (data) => {
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

      await this.deTaiService
        .GetDetaiByPhanbienOfGiangvienDotdk(
          HomeMainComponent.maGV,
          shareService.namHoc,
          shareService.dot
        )
        .then(async (data) => {
          this.deTais.push(...data);

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
  }

  onUpdate(event: any) {
    let id = event.target.dataset.index;
    let deTai =
      this.sinhViens.find((t) => t.maDT === id) ||
      this.restDeTais.find((t) => t.maDT === id);

    this.maDt = id;

    if (deTai) {
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
  }

  async onSelectGVHD(event: any) {
    let hd = new HuongDan();
    let index = this.GVPBInputConfig.data.findIndex(
      (t: any) => t.maGv === event.maGv
    );

    hd.init(event.maGv, this.maDt, true);
    this.GVPBInputConfig.data.splice(index, 1);

    try {
      await this.huongDanService.add(hd);
      // Đây - Thêm HDCham cho toàn bộ sinh viên trong nhóm
      let sinhViens = await this.getSinhvienByDt(this.maDt);
      for(let sv of sinhViens) {
        let hdcham = new HdCham();
        hdcham.init(
          HomeMainComponent.maGV,
          this.maDt,
          sv.maSv,
          shareService.namHoc,
          shareService.dot,
          -1
        );
        await this.hdChamService.add(hdcham); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onUnSelectGVHD(event: any) {
    this.GVPBInputConfig.data.push(event);

    try {
      await this.hdChamService.delete(HomeMainComponent.maGV, this.maDt);
      await this.huongDanService.delete(event.maGv, this.maDt);

    } catch (error) {
      console.log(error);
    }
  }

  async onSelectGVPB(event: any) {
    let pb = new PhanBien();
    let index = this.GVHDInputConfig.data.findIndex(
      (t: any) => t.maGv === event.maGv
    );

    pb.init(event.maGv, this.maDt, true);
    this.GVHDInputConfig.data.splice(index, 1);

    try {
        await this.phanBienService.add(pb);
      // Đây - Thêm PBCham cho toàn bộ sinh viên trong nhóm
      let sinhViens = await this.getSinhvienByDt(this.maDt);
      for (let sv of sinhViens) {
        let pbcham = new PbCham();
        pbcham.init(
          HomeMainComponent.maGV,
          this.maDt,
          sv.maSv,
          shareService.namHoc,
          shareService.dot,
          -1
        );
        await this.pbChamService.add(pbcham);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onUnSelectGVPB(event: any) {
    this.GVHDInputConfig.data.push(event);

    // Đây - Xóa PBCham cho toàn bộ sinh viên trong nhóm
    await this.pbChamService.delete(HomeMainComponent.maGV, this.maDt);

    await this.phanBienService.delete(event.maGv, this.maDt);
  }

  getRowSpan(maDT: string) {
    return this.rowSpans.find((t) => t.maDT === maDT).span!;
  }

  getDeTaiByID(maDT: string) {
    return this.deTais.find((t) => t.maDT === maDT)?.tenDT!;
  }

  async getSinhvienByDt (maDt: string){
    return await this.sinhVienService.getSinhvienByDetai(maDt);
  }
}
