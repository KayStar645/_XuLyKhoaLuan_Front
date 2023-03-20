import { HomeDanhsachsinhvienComponent } from './home-danhsachsinhvien/home-danhsachsinhvien.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { userService } from 'src/app/services/user.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-home-sinhvien',
  templateUrl: './home-sinhvien.component.html',
})
export class HomeSinhvienComponent implements OnInit {
  @ViewChild(HomeDanhsachsinhvienComponent)
  protected DSSVComponent!: HomeDanhsachsinhvienComponent;
  listChuyenNganh: ChuyenNganh[] = [];
  searchName = '';
  selectedChuyenNganh!: string;
  isSelectedSV: boolean = false;

  namHoc!: string;
  dot!: number;

  sinhVienFile: any;

  constructor(
    private titleService: Title,
    private chuyenNganhService: chuyenNganhService,
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }
  }
  
  setIsSelectedSv(event: any) {
    this.isSelectedSV = event;
  }

  getSinhVienByMaCN(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.DSSVComponent.getAllSinhVien();
    } else {
      this.DSSVComponent.getSinhVienByMaCN(maCn);
    }
  }
}

