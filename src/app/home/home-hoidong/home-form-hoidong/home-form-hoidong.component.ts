import { deTaiService } from './../../../services/deTai.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownComponent } from 'src/app/components/drop-down/drop-down.component';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { giangVienService } from 'src/app/services/giangVien.service';
import { HoiDong } from 'src/app/models/HoiDong.model';
import { ThamGiaHd } from 'src/app/models/ThamGiaHd.model';
import { Form, dateVNConvert } from 'src/assets/utils';
import { Validators } from '@angular/forms';
import { hoiDongService } from 'src/app/services/hoiDong.service';
import { thamGiaHdService } from 'src/app/services/thamGiaHD.service';
import { ToastrService } from 'ngx-toastr';
import { shareService } from 'src/app/services/share.service';
import { DeTai } from 'src/app/models/DeTai.model';

type GVInputConfigProp = {
  items: GiangVien[];
  keyword?: string;
  selectedItem: GiangVien[];
};

@Component({
  selector: 'app-home-form-hoidong',
  templateUrl: './home-form-hoidong.component.html',
  styleUrls: ['./home-form-hoidong.component.scss'],
})
export class HomeFormHoidongComponent implements OnInit {
  @ViewChild('chuTich') chuTichComponent!: DropDownComponent;
  @ViewChild('thuKy') thuKyComponent!: DropDownComponent;
  @ViewChild('uyVien') uyVienComponent!: DropDownComponent;

  constructor(
    private giangVienService: giangVienService,
    private hoiDongService: hoiDongService,
    private thamGiaHdService: thamGiaHdService,
    private toastService: ToastrService,
    private shareService: shareService,
    private deTaiService: deTaiService
  ) {}

  hoiDong: Form = new Form({
    tenHd: ['', Validators.required],
    maHd: ['', Validators.required],
    diaDiem: ['', Validators.required],
    TGBatDau: ['', Validators.required],
    TGKetThuc: ['', Validators.required],
    ngayBD: ['', Validators.required],
  });

  deTais: DeTai[] = [];
  selectedDetais: DeTai[] = [];
  searchedDetais: DeTai[] = [];

  CTInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  TKInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  UVInputConfig: GVInputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };

  async ngOnInit(): Promise<void> {
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
      hoiDong.maBm = HomeMainComponent.maBm;

      chuTich.maGv = selectedCT.maGv;
      chuTich.maHd = formValue.maHd;
      chuTich.maVt = 'VT01';

      thuKy.maGv = selectedTK.maGv;
      thuKy.maHd = formValue.maHd;
      thuKy.maVt = 'VT02';

      selectedUVs.forEach((uv) => {
        uyViens.push({ maGv: uv.maGv, maHd: formValue.maHd, maVt: 'VT03' });
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

  onDateChange($event: any) {}

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
