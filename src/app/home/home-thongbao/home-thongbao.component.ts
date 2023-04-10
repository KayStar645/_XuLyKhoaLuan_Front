import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Form } from 'src/assets/utils';
import { HomeDanhsachthongbaoComponent } from './home-danhsachthongbao/home-danhsachthongbao.component';

@Component({
  selector: 'app-home-thongbao',
  templateUrl: './home-thongbao.component.html',
  styleUrls: ['./home-thongbao.component.scss'],
})
export class HomeThongbaoComponent {
  @ViewChild(HomeDanhsachthongbaoComponent)
  protected DSTBComponent!: HomeDanhsachthongbaoComponent;
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
