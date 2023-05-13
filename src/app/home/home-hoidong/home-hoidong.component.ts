import { shareService } from './../../services/share.service';
import { thamGiaHdService } from './../../services/thamGiaHD.service';
import { hoiDongService } from './../../services/hoiDong.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { Component, OnInit } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { Form, dateVNConvert } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { HoiDong } from 'src/app/models/HoiDong.model';
import { ThamGiaHd } from 'src/app/models/ThamGiaHd.model';
import { ToastrService } from 'ngx-toastr';
import { HomeMainComponent } from '../home-main/home-main.component';
import { HoiDongVT } from 'src/app/models/VirtualModel/HoiDongVTModel';

type InputConfigProp = {
  items: GiangVien[];
  keyword?: string;
  selectedItem: GiangVien[];
};

@Component({
  selector: 'app-home-hoidong',
  templateUrl: './home-hoidong.component.html',
  styleUrls: ['./home-hoidong.component.scss'],
})
export class HomeHoidongComponent implements OnInit {
  hoiDongs: HoiDongVT[] = [];

  CTInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  TKInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  UVInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };

  hoiDong: Form = new Form({
    tenHd: ['', Validators.required],
    maHd: ['', Validators.required],
    diaDiem: ['', Validators.required],
    TGBatDau: ['', Validators.required],
    TGKetThuc: ['', Validators.required],
    ngayBD: ['', Validators.required],
  });

  constructor(
    private giangVienService: giangVienService,
    private hoiDongService: hoiDongService,
    private thamGiaHdService: thamGiaHdService,
    private toastService: ToastrService,
    private shareService: shareService
  ) {}

  async ngOnInit(): Promise<void> {
    this.hoiDongs = await this.hoiDongService.GetHoidongsByGiangvien(
      HomeMainComponent.maGV
    );
    //console.log(this.hoiDongs);

    this.CTInputConfig.items = await this.giangVienService.getByBoMon(
      HomeMainComponent.maBm
    );
    this.TKInputConfig.items = this.CTInputConfig.items;
    this.UVInputConfig.items = this.CTInputConfig.items;
  }

  onShowFormAdd() {
    document.documentElement.classList.add('no-scroll');
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.add('active');
    create.classList.add('active');
    this.hoiDong.resetForm('#create_box');
  }

  handleToggleAdd() {
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.remove('active');
    create.classList.remove('active');
    document.documentElement.classList.remove('no-scroll');
  }

  async addHoiDong() {
    try {
      let hoiDong = new HoiDong();
      let chuTich = new ThamGiaHd();
      let thuKy = new ThamGiaHd();
      let uyViens: ThamGiaHd[] = [];
      let [selectedCT] = this.CTInputConfig.selectedItem;
      let [selectedTK] = this.TKInputConfig.selectedItem;
      let selectedUVs = this.UVInputConfig.selectedItem;
      let formValue: any = this.hoiDong.form.value;
      let ngayLap = dateVNConvert(formValue.ngayBD);

      hoiDong.maHd = formValue.maHd;
      hoiDong.tenHd = formValue.tenHd;
      hoiDong.diaDiem = formValue.diaDiem;
      hoiDong.ngayLap = ngayLap;
      hoiDong.thoiGianBD = ngayLap + 'T' + formValue.TGBatDau + '.000Z';
      hoiDong.thoiGianKT = ngayLap + 'T' + formValue.TGKetThuc + '.000Z';

      chuTich.maGv = selectedCT.maGv;
      chuTich.maHd = formValue.maHd;
      chuTich.maVt = 'VT1';

      thuKy.maGv = selectedTK.maGv;
      thuKy.maHd = formValue.maHd;
      thuKy.maVt = 'VT2';

      selectedUVs.forEach((uv) => {
        uyViens.push({ maGv: uv.maGv, maHd: formValue.maHd, maVt: 'VT3' });
      });

      await this.hoiDongService.add(hoiDong);
      await this.thamGiaHdService.add(chuTich);
      await this.thamGiaHdService.add(thuKy);
      uyViens.forEach(async (uv) => {
        await this.thamGiaHdService.add(uv);
      });

      this.toastService.success('Thêm hội đồng thành công', 'Thông báo !');
    } catch (error) {
      this.toastService.error('Thêm hội đồng thất bại', 'Thông báo !');
    }
  }

  // Danh sách chủ tịch fix ở đây
  onSelectCT($event: GiangVien) {
    let ctUVIndex = this.TKInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let ctTKIndex = this.UVInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.UVInputConfig.items?.splice(ctUVIndex, 1);
    this.TKInputConfig.items?.splice(ctTKIndex, 1);
  }
  onUnSelecCT($event: GiangVien) {
    this.UVInputConfig.items = [$event, ...this.UVInputConfig.items];
    this.TKInputConfig.items = [$event, ...this.TKInputConfig.items];
  }

  // Danh sách thư ký fix ở đây
  onSelectTK($event: GiangVien) {
    let tkCTIndex = this.CTInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let tkUVIndex = this.UVInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.CTInputConfig.items?.splice(tkCTIndex, 1);
    this.UVInputConfig.items?.splice(tkUVIndex, 1);
  }
  onUnSelectTK($event: GiangVien) {
    this.CTInputConfig.items = [$event, ...this.CTInputConfig.items];
    this.UVInputConfig.items = [$event, ...this.UVInputConfig.items];
  }

  // Danh sách ủy viên fix ở đây
  onSelectUV($event: GiangVien) {
    let uvCTIndex = this.CTInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let uvTKIndex = this.TKInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.CTInputConfig.items?.splice(uvCTIndex, 1);
    this.TKInputConfig.items?.splice(uvTKIndex, 1);
  }
  onUnSelectUV($event: GiangVien) {
    this.CTInputConfig.items = [$event, ...this.CTInputConfig.items];
    this.TKInputConfig.items = [$event, ...this.TKInputConfig.items];
  }

  onDateChange($event: any) {}

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
