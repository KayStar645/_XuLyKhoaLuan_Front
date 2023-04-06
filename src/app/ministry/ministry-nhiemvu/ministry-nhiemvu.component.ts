import { Title } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { MinistryDanhsachnhiemvuComponent } from './ministry-danhsachnhiemvu/ministry-danhsachnhiemvu.component';
import { Form, getParentElement, Option } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { boMonService } from 'src/app/services/boMon.service';
import { ToastrService } from 'ngx-toastr';
import { BoMon } from 'src/app/models/BoMon.model';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';

@Component({
  selector: 'app-ministry-phancong',
  templateUrl: './ministry-nhiemvu.component.html',
  // styleUrls: ['./ministry-nhiemvu.component.scss'],
})
export class MinistryNhiemvuComponent implements OnInit {
  @ViewChild(MinistryDanhsachnhiemvuComponent)
  protected DSNVComponent!: MinistryDanhsachnhiemvuComponent;
  nvAddForm: any;
  nvUpdateForm: any;
  nvOldForm: any;
  listBoMon: BoMon[] = [];

  nvForm = new Form({
    maNv: ['', Validators.required],
    tenNv: ['', Validators.required],
    soLuongDt: [''],
    thoiGianBd: ['', Validators.required],
    thoiGianKt: [''],
    hinhAnh: [''],
    fileNv: ['', Validators.required],
    maBm: ['', Validators.required],
    maGv: ['', Validators.required],
  });

  constructor(
    private titleService: Title,
  ) {
    this.nvAddForm = this.nvForm.form;
    this.nvUpdateForm = this.nvForm.form;
  }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách nhiệm vụ');
  }
}
