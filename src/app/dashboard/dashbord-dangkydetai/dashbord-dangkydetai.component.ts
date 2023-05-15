import { pbChamService } from './../../services/pbCham.service';
import { hdChamService } from './../../services/hdCham.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { WebsocketService } from './../../services/Websocket.service';
import { chuyenNganhService } from './../../services/chuyenNganh.service';
import { deTai_chuyenNganhService } from './../../services/deTai_chuyenNganh.service';
import { huongDanService } from './../../services/huongDan.service';
import { giangVienService } from './../../services/giangVien.service';
import { shareService } from './../../services/share.service';
import { dangKyService } from './../../services/dangKy.service';
import { deTaiService } from './../../services/deTai.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DeTai } from 'src/app/models/DeTai.model';
import { HomeComponent } from 'src/app/home/home.component';
import { DashboardComponent } from '../dashboard.component';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { getParentElement } from 'src/assets/utils';
import { DangKy } from 'src/app/models/DangKy.model';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { nhomService } from 'src/app/services/nhom.service';
import { PbCham } from 'src/app/models/PbCham.model';
import { HdCham } from 'src/app/models/HdCham.model';
import { GiangVienDtVT } from 'src/app/models/VirtualModel/GiangVienDtVTModel';

@Component({
  selector: 'app-dashbord-dangkydetai',
  templateUrl: './dashbord-dangkydetai.component.html',
  styleUrls: ['./dashbord-dangkydetai.component.scss'],
})
export class DashbordDangkydetaiComponent {
  lineDT!: DeTai;
  oldParent: any;
  lineDTdk!: DeTai;
  isDangky: boolean = false;
  isTruongnhom: boolean = false;

  listDT: DeTai[] = [];
  listGiangvien: GiangVien[] = [];
  listHuongdan: HuongDan[] = [];
  listChuyennganh: ChuyenNganh[] = [];
  listCnPhuhop: DeTai_ChuyenNganh[] = [];

  _ListCn: string[] = ['CNPM', 'MMT', 'KHPTDL', 'HTTT'];

  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private deTaiService: deTaiService,
    private dangKyService: dangKyService,
    private giangVienService: giangVienService,
    private huongDanService: huongDanService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private chuyenNganhService: chuyenNganhService,
    private websocketService: WebsocketService,
    private nhomService: nhomService,
    private sinhVienService: sinhVienService,
    private hdChamService: hdChamService,
    private pbChamService: pbChamService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Đăng ký đề tài');

    this.listHuongdan = await this.huongDanService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();
    this.listCnPhuhop = await this.deTai_chuyenNganhService.getAll();
    this.isTruongnhom = await this.nhomService.isTruongnhom(
      DashboardComponent.maSV,
      shareService.namHoc,
      shareService.dot,
      DashboardComponent.maNhom
    );

    this.isDangky = (await this.dangKyService.isNhomDangkyDetaiAsyc(
      DashboardComponent.maNhom
    ))
      ? true
      : false;

    await this.getAllDangky();

    this.websocketService.startConnection();
    this.websocketService.receiveFromDangKy(async (dataChange: boolean) => {
      if (dataChange) {
        await this.getAllDangky();
      }
    });
  }

  async getAllDangky() {
    this.listDT = await this.dangKyService.GetAllDetaiDangky(
      shareService.namHoc,
      shareService.dot,
      DashboardComponent.maNhom,
      false
    );

    if (this.isDangky) {
      this.lineDTdk = await this.dangKyService.GetDetaiDangkyAsync(
        DashboardComponent.maNhom,
        shareService.namHoc,
        shareService.dot
      );
    }
  }

  getTenGvHuongdanByMaDT(maDT: string) {
    let result = [];
    let huongDans = this.listHuongdan.filter((item) => item.maDt == maDT);
    for (let item of huongDans) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getChuyennganhPhuhop(maDT: string) {
    let result = [];
    let chuyenNganhs = this.listCnPhuhop.filter((item) => item.maDt == maDT);
    let count = 0;
    if (chuyenNganhs.length >= 4) {
      for (let cn of chuyenNganhs) {
        if (this._ListCn.includes(cn.maCn)) {
          count++;
        }
      }
    }
    if (count == 4) {
      result.push('Công nghệ thông tin');
    }
    for (let item of chuyenNganhs) {
      if (count == 4 && this._ListCn.includes(item.maCn)) {
        continue;
      }
      result.push(this.listChuyennganh.find((g) => g.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  async clickLine(event: any, dt: DeTai) {
    const parent = getParentElement(event.target, '.br-line');

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineDT = dt;
      parent.classList.add('br-line-dblclick');
    } else {
      this.lineDT = new DeTai();
      parent.classList.remove('br-line-dblclick');
    }

    if (this.oldParent && this.oldParent != parent) {
      if (this.oldParent.classList.contains('br-line-dblclick')) {
        this.oldParent.classList.remove('br-line-dblclick');
      }
    }
    this.oldParent = parent;
  }

  async onDangKy(deTai: DeTai) {
    if (deTai) {
      let dk = new DangKy();
      dk.init2(DashboardComponent.maNhom, deTai.maDT, new Date().toISOString());

      try {
        await this.dangKyService.add(dk);
        this.websocketService.sendForDangKy(true);
        this.lineDTdk = await this.deTaiService.getById(deTai.maDT);
        this.toastr.success('Thành công!', 'Đăng ký đề tài thành công!');

        this.isDangky = true;

        var giangVienDt = await this.deTaiService.GetGiangvienByDetai(
          deTai.maDT
        );
        
        // Thêm HdCham - Danh sách GVHD
        for (var gv of giangVienDt.gvhds) {
          this.addHdCham(deTai.maDT, gv.maGV);
        }
        // Thêm PbCham - Danh sách GVPB
        for (var gv of giangVienDt.gvpbs) {
          this.addPbCham(deTai.maDT, gv.maGV);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async addHdCham(maDt: string, maGv: string) {
    // Đây - Thêm HDCham cho toàn bộ sinh viên trong nhóm
    let sinhViens = await this.sinhVienService.getSinhvienByDetai(maDt);
    for (let sv of sinhViens) {
      let hdcham = new HdCham();
      hdcham.init(
        maGv,
        maDt,
        sv.maSv,
        shareService.namHoc,
        shareService.dot,
        -1
      );
      await this.hdChamService.add(hdcham);
    }
  }

  async addPbCham(maDt: string, maGv: string) {
    // Đây - Thêm PBCham cho toàn bộ sinh viên trong nhóm
    let sinhViens = await this.sinhVienService.getSinhvienByDetai(maDt);
    for (let sv of sinhViens) {
      let pbcham = new PbCham();
      pbcham.init(
        maGv,
        maDt,
        sv.maSv,
        shareService.namHoc,
        shareService.dot,
        -1
      );
      await this.pbChamService.add(pbcham);
    }
  }

  async onHuyDangKy(maDT: string) {
    try {
      await this.dangKyService.delete(maDT, DashboardComponent.maNhom);
      this.websocketService.sendForDangKy(true);
      this.lineDTdk = new DeTai();
      this.toastr.success('Thành công!', 'Hủy đề tài thành công!');

      this.isDangky = false;

      // // Xóa nè Chấm điểm nè
      // var giangVienDt = await this.deTaiService.GetGiangvienByDetai(maDT);
      // // Thêm HdCham - Danh sách GVHD
      // for (var gv of giangVienDt.gvhDs) {
      //   await this.hdChamService.delete(gv.maGV, maDT);
      // }
      // // Thêm PbCham - Danh sách GVPB
      // for (var gv of giangVienDt.gvpBs) {
      //   this.addPbCham(deTai.maDT, gv.maGV);
      // }
    } catch (error) {
      console.log(error);
    }
  }
}
