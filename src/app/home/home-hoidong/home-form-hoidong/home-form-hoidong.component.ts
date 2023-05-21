import { deTaiService } from '../../../services/deTai.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/drop-down/drop-down.component';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { giangVienService } from 'src/app/services/giangVien.service';
import { Validators } from '@angular/forms';
import { hoiDongService } from 'src/app/services/hoiDong.service';
import { ToastrService } from 'ngx-toastr';
import { shareService } from 'src/app/services/share.service';
import { DeTai } from 'src/app/models/DeTai.model';
import { TL_HoiDongVT } from 'src/app/models/VirtualModel/TL_HoiDongVTModel';
import { GiangVienVT } from 'src/app/models/VirtualModel/GiangVienVTModel';
import { dateVNConvert, Form, Option } from 'src/assets/utils';

type GVInputConfigProp = {
  items: GiangVien[];
  keyword?: string;
  selectedItem: GiangVien[];
};

@Component({
  selector: 'app-home-form-hoidong',
  templateUrl: './home-form-hoidong.component.html',
  styleUrls: ['./home-form-hoidong.component.scss']
})
export class HomeFormHoidongComponent implements OnInit {
  @ViewChild('chuTich') chuTichComponent!: DropDownComponent;
  @ViewChild('thuKy') thuKyComponent!: DropDownComponent;
  @ViewChild('uyVien') uyVienComponent!: DropDownComponent;

  hoiDong: Form = new Form({
    maHd: ['', Validators.required],
    tenHd: ['', Validators.required],
    thoiGianBd: ['', Validators.required],
    thoiGianKt: ['', Validators.required],
    diaDiem: ['', Validators.required],
    chuTich: ['', Validators.required],
    thuKy: ['', Validators.required],
    uyVien: ['', Validators.required]
  });

  form = this.hoiDong.form;

  deTais: DeTai[] = [];
  selectedDetais: DeTai[] = [];
  searchedDetais: DeTai[] = [];

  CTInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv'
  };
  TKInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv'
  };
  UVInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv'
  };

  isAdd = true;

  constructor(
    private giangVienService: giangVienService,
    private hoiDongService: hoiDongService,
    private shareService: shareService,
    private deTaiService: deTaiService,
    private ToastrService: ToastrService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.isAdd = window.history.state.isAdd;

    this.CTInputConfig.items = await this.giangVienService.getByBoMon(
      HomeMainComponent.maBm
    );
    this.TKInputConfig.items = await this.giangVienService.getByBoMon(
      HomeMainComponent.maBm
    );
    this.UVInputConfig.items = await this.giangVienService.getByBoMon(
      HomeMainComponent.maBm
    );
    this.deTais = await this.deTaiService.getAll();
    this.searchedDetais = this.deTais;
  }

  onSelect(dt: DeTai) {
    this.deTais.splice(this.deTais.indexOf(dt), 1);
    this.selectedDetais.push(dt);
  }

  onRemove(dt: DeTai) {
    this.selectedDetais.splice(this.selectedDetais.indexOf(dt), 1);
    this.deTais.push(dt);
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
    this.uyVienComponent.undoRemoveItem();
    this.thuKyComponent.undoRemoveItem();
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
    this.chuTichComponent.undoRemoveItem();
    this.uyVienComponent.undoRemoveItem();
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
    this.chuTichComponent.undoRemoveItem();
    this.thuKyComponent.undoRemoveItem();
  }

  onUnSelectUV($event: GiangVien) {
    this.CTInputConfig.items = [$event, ...this.CTInputConfig.items];
    this.TKInputConfig.items = [$event, ...this.TKInputConfig.items];
  }

  onDateChange($event: any) {
  }

  async addHoiDong() {
    let formValue: any = this.hoiDong.form.value;

    let chuTich = new GiangVienVT();
    chuTich.createNull();
    chuTich.maGV = this.CTInputConfig.selectedItem[0]?.maGv;

    let thuKy = new GiangVienVT();
    thuKy.createNull();
    thuKy.maGV = this.TKInputConfig.selectedItem[0]?.maGv;

    let uyViens: GiangVienVT[] = [];
    for (let gv of this.UVInputConfig.selectedItem) {
      let uyVien = new GiangVienVT();
      uyVien.createNull();
      uyVien.maGV = gv.maGv;
      uyViens.push(uyVien);
    }

    let tlHoiDong = new TL_HoiDongVT();
    tlHoiDong.initHoiDong(
      formValue.maHd,
      formValue.tenHd,
      new Date().toISOString(),
      dateVNConvert(formValue.thoiGianBd.slice(0, 10)) +
      'T' +
      formValue.thoiGianBd.slice(11) +
      '.000Z',
      dateVNConvert(formValue.thoiGianBd.slice(0, 10)) +
      'T' +
      formValue.thoiGianKt +
      '.000Z',
      formValue.diaDiem,
      HomeMainComponent.maBm,
      chuTich,
      thuKy,
      uyViens
    );

    let deTais: DeTai[] = [];
    for (let dt of this.selectedDetais) {
      let deTai = new DeTai();
      deTai.maDT = dt.maDT;
      deTais.push(deTai);
    }
    tlHoiDong.deTais = deTais;

    if (this.isAdd) {
      await this.hoiDongService.add(tlHoiDong);
    } else {
      await this.hoiDongService.update(tlHoiDong);
    }
  }

  async onSaveHoiDong() {
    try {
      if (this.form.valid) {
        this.ToastrService.success(
          'Cập nhật hội đồng thành công!',
          'Thông báo !'
        );
      } else {
        this.hoiDong.validate('.add-form');
        this.ToastrService.warning(
          'Thông tin bạn cung cấp không hợp lệ',
          'Thông báo !'
        );
      }
    } catch {
      this.ToastrService.error(
        'Cập nhật hội đồng không thành công!',
        'Thông báo !'
      );
    }
  }

  onSearch(event: Event) {
    let element = event.target as HTMLInputElement;
    let value = element.value;

    if (value) {
      this.searchedDetais = this.deTais.filter(
        (t) => t.maDT.includes(value) || t.tenDT.includes(value)
      );
    } else {
      this.searchedDetais = this.deTais;
    }
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
