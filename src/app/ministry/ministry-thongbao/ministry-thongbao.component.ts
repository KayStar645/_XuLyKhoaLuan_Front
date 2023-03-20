import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import { MinistryDanhsachthongbaoComponent } from './ministry-danhsachthongbao/ministry-danhsachthongbao.component';
import { ThongBao } from '../../models/ThongBao.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ministry-thongbao',
  templateUrl: './ministry-thongbao.component.html',
  styleUrls: ['./ministry-thongbao.component.scss'],
})
export class MinistryThongbaoComponent implements OnInit {
  @ViewChild(MinistryDanhsachthongbaoComponent)
  protected DSTBComponent!: MinistryDanhsachthongbaoComponent;
  searchName = '';

  tbAddForm: any;
  tbUpdateForm: any;
  dtOldForm: any;

  tbForm = new Form({
    maTb: ['', Validators.required],
    tenTb: ['', Validators.required],
    moTa: ['', Validators.email],
    noiDung: [''],
    hinhAnh: ['', Validators.required],
    fileTb: [''],
    maKhoa: ['', Validators.required],
    ngayTb: ['', Validators.required],
  });

  constructor(private titleService: Title) {
    this.tbAddForm = this.tbForm.form;
    this.tbUpdateForm = this.tbForm.form;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách thông báo');
  }
}
