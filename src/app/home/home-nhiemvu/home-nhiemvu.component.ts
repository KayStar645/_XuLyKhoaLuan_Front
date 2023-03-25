import { HomeDanhsachnhiemvuComponent } from './home-danhsachnhiemvu/home-danhsachnhiemvu.component';
import { Title } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { Form } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { BoMon } from 'src/app/models/BoMon.model';

@Component({
  selector: 'app-home-phancong',
  templateUrl: './home-nhiemvu.component.html',
  styleUrls: ['./home-nhiemvu.component.scss']
})
export class HomeNhiemvuComponent {
  @ViewChild(HomeDanhsachnhiemvuComponent)
  protected DSNVComponent!: HomeDanhsachnhiemvuComponent;
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

