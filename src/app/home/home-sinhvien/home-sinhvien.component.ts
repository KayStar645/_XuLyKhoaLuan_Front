import { dotDkService } from './../../services/dotDk.service';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { HomeDanhsachsinhvienComponent } from './home-danhsachsinhvien/home-danhsachsinhvien.component';

@Component({
  selector: 'app-home-sinhvien',
  templateUrl: './home-sinhvien.component.html',
})
export class HomeSinhvienComponent implements OnInit {
  @ViewChild(HomeDanhsachsinhvienComponent)
  protected DSTGComponent!: HomeDanhsachsinhvienComponent;
  listChuyenNganh: ChuyenNganh[] = [];

  listSinhVien: SinhVien[] = [];

  listDotDk: DotDk[] = [];
  searchName = '';
  selectedChuyenNganh!: string;
  isSelectedTG: boolean = false;
  selectedSV: any[] = [];

  namHoc!: string;
  dot!: number;

  constructor(
    private titleService: Title,
    private chuyenNganhService: chuyenNganhService,
    private sinhVienService: sinhVienService,
    private dotDkService: dotDkService,
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }
    this.listDotDk = await this.dotDkService.getAll();
    if (this.listDotDk.length > 0) {
      this.namHoc = this.listDotDk[0].namHoc;
      this.dot = this.listDotDk[0].dot;
    }
    this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);
  }

  async resetList() {
    this.listDotDk = await this.dotDkService.getAll();
    this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);
  }

  getThamgiaByMaCN(event: any) {
    const maCn = event.target.value;
    this.DSTGComponent.getThamgiaByMaCN(maCn);
  }

  getTenCnById(maCn: string) {
    return this.DSTGComponent.getTenCNById(maCn);
  }
}