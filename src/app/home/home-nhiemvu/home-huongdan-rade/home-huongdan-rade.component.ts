import { HdCham } from './../../../models/HdCham.model';
import { pbChamService } from './../../../services/pbCham.service';
import { hdChamService } from './../../../services/hdCham.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DropDownComponent } from 'src/app/components/drop-down/drop-down.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-huongdan-rade',
  templateUrl: './home-huongdan-rade.component.html',
  styleUrls: ['./home-huongdan-rade.component.scss'],
})
export class HomeHuongdanRadeComponent implements OnInit {
  @ViewChild('GVHD_Input')
  GVHD_Input!: DropDownComponent;
  @ViewChild('GVPB_Input')
  GVPB_Input!: DropDownComponent;
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
    private pbChamService: pbChamService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;

    await this.getAllDetai();
  }

  async getListGV(
    gvhds: any[],
    selectedGVHD: any,
    gvpbs: any[],
    selectedGVPB: any
  ) {
    // Xử lý lại hàm này nè
    this.GVHDInputConfig.data = gvhds;
    this.GVHDInputConfig.keyWord = 'tenGv';
    this.GVHDInputConfig.selectedItem = selectedGVHD;

    this.GVPBInputConfig.data = gvpbs;
    this.GVPBInputConfig.keyWord = 'tenGv';
    this.GVPBInputConfig.selectedItem = selectedGVPB;
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

  async onUpdate(event: any) {
    let id = event.target.dataset.index;
    let deTai =
      this.sinhViens.find((t) => t.maDT === id) ||
      this.restDeTais.find((t) => t.maDT === id);

    this.maDt = id;

    if (deTai) {
      let gvhds = await this.giangVienService.GetGiangVienByNhiemVu(
        HomeMainComponent.maBm,
        this.maDt,
        1
      );
      let gvpbs = await this.giangVienService.GetGiangVienByNhiemVu(
        HomeMainComponent.maBm,
        this.maDt,
        2
      );
      await this.getListGV(gvhds, deTai.giangVienHD, gvpbs, deTai.giangVienPB);
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
      try {
        // Đây - Thêm HDCham cho toàn bộ sinh viên trong nhóm
        let sinhViens = await this.getSinhvienByDt(this.maDt);
        for (let sv of sinhViens) {
          let hdcham = new HdCham();
          hdcham.init(
            event.maGv,
            this.maDt,
            sv.maSv,
            shareService.namHoc,
            shareService.dot,
            -1
          );
          await this.hdChamService.add(hdcham);
        }
      } catch {
        this.toastr.error(
          'Không cho phép giảng viên chấm điểm!',
          'Thông báo !'
        );
      }
    } catch {
      this.toastr.error(
        'Thêm giảng viên hướng dẫn không thành công!',
        'Thông báo !'
      );
    }
  }

  async onUnSelectGVHD(event: any) {
    try {
      let flag = await this.hdChamService.DeleteHdchamsByGvDt(
        event.maGv,
        this.maDt,
        shareService.namHoc,
        shareService.dot
      );
      if (false == flag) {
        this.GVHD_Input.undoRemoveSelectedItem();
        this.toastr.error(
          'Giảng viên này đã chấm điểm cho sinh viên, không thể thay đổi giảng viên!',
          'Thông báo !'
        );
      } else {
        await this.huongDanService.delete(event.maGv, this.maDt);
      }
      this.GVPBInputConfig.data.push(event);
    } catch (error) {
      this.GVHD_Input.undoRemoveSelectedItem();
      this.toastr.error(
        'Xóa giảng viên hướng dẫn không thành công!',
        'Thông báo !'
      );
    }
  }

  async onSelectGVPB(event: any) {
    // Xu ly ne
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
          event.maGv,
          this.maDt,
          sv.maSv,
          shareService.namHoc,
          shareService.dot,
          -1
        );
        await this.pbChamService.add(pbcham);
      }
    } catch (error) {
      this.toastr.error(
        'Thêm giảng viên phản biện không thành công!',
        'Thông báo !'
      );
    }
  }

  async onUnSelectGVPB(event: any) {
    try {
      // Đây - Xóa PBCham cho toàn bộ sinh viên trong nhóm
      let flag = await this.pbChamService.DeletePbchamsByGvDt(
        event.maGv,
        this.maDt,
        shareService.namHoc,
        shareService.dot
      );
      if (false == flag) {
        this.GVPB_Input.undoRemoveSelectedItem();
        this.toastr.error(
          'Giảng viên này đã chấm điểm cho sinh viên, không thể thay đổi giảng viên!',
          'Thông báo !'
        );
      } else {
        await this.phanBienService.delete(event.maGv, this.maDt);
      }
      this.GVHDInputConfig.data.push(event);
    } catch {
      this.GVPB_Input.undoRemoveSelectedItem();
      this.toastr.error(
        'Xóa giảng viên phản biện không thành công!',
        'Thông báo !'
      );
    }
  }

  getRowSpan(maDT: string) {
    return this.rowSpans.find((t) => t.maDT === maDT).span!;
  }

  getDeTaiByID(maDT: string) {
    return this.deTais.find((t) => t.maDT === maDT)?.tenDT!;
  }

  async getSinhvienByDt(maDt: string) {
    return await this.sinhVienService.getSinhvienByDetai(maDt);
  }
}
