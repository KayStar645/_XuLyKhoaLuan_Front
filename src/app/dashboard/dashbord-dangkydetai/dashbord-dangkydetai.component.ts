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

@Component({
  selector: 'app-dashbord-dangkydetai',
  templateUrl: './dashbord-dangkydetai.component.html',
  styleUrls: ['./dashbord-dangkydetai.component.scss'],
})
export class DashbordDangkydetaiComponent {
  lineDT!: DeTai;
  oldParent: any;
  lineDTdk!: DeTai;

  listDT: DeTai[] = [];
  listGiangvien: GiangVien[] = [];
  listHuongdan: HuongDan[] = [];
  listChuyennganh: ChuyenNganh[] = [];
  listCnPhuhop: DeTai_ChuyenNganh[] = [];

  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private deTaiService: deTaiService,
    private dangKyService: dangKyService,
    private giangVienService: giangVienService,
    private huongDanService: huongDanService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private chuyenNganhService: chuyenNganhService
  ) {}

  public async ngOnInit() {
    this.titleService.setTitle('Đăng ký đề tài');

    this.listHuongdan = await this.huongDanService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();
    this.listCnPhuhop = await this.deTai_chuyenNganhService.getAll();

    this.listDT = await this.dangKyService.GetAllDetaiDangky(
      shareService.namHoc,
      shareService.dot,
      DashboardComponent.maNhom
    );
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
    for (let item of chuyenNganhs) {
      result.push(this.listChuyennganh.find((g) => g.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineDT = await this.deTaiService.getById(firstChild.innerText);
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

  async onDangKy(maDT: string) {
    let dk = new DangKy();
    // dk.init(DashboardComponent.maNhom, maDT, '', '', ''); // Xem lại cái này
    dk.maDt = maDT;
    dk.maNhom = DashboardComponent.maNhom;
    dk.ngayDk = (new Date()).toISOString();

    await this.dangKyService.add(dk);
    this.lineDTdk = await this.deTaiService.getById(maDT);
    this.toastr.success('Thành công!', 'Đăng ký đề tài thành công!');
  }

  async onHuyDangKy(maDT: string) {
    await this.dangKyService.delete(maDT, DashboardComponent.maNhom);
    this.lineDTdk = new DeTai();
    this.toastr.success('Thành công!', 'Hủy đề tài thành công!');
  }
}
