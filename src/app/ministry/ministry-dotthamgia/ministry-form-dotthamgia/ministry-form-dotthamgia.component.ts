import { nhomService } from './../../../services/nhom.service';
import { shareService } from './../../../services/share.service';
import { dotDkService } from './../../../services/dotDk.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { SinhVienVT } from 'src/app/models/VirtualModel/SinhVienVTModel';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DotDk } from 'src/app/models/DotDk.model';
import { ToastrService } from 'ngx-toastr';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-ministry-form-dotthamgia',
  templateUrl: './ministry-form-dotthamgia.component.html',
  styleUrls: ['./ministry-form-dotthamgia.component.scss'],
})
export class MinistryFormDotthamgiaComponent implements OnInit {
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;

  listSv: SinhVienVT[] = [];
  temps: SinhVienVT[] = [];

  listCn: ChuyenNganh[] = [];
  listDotDk: DotDk[] = [];

  selectedSV: any[] = [];

  constructor(
    private chuyenNganhService: chuyenNganhService,
    private toastService: ToastrService,
    private nhomService: nhomService,
    private sinhVienService: sinhVienService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
    private websocketService: WebsocketService,
    private shareService: shareService
  ) {}

  async ngOnInit() {
    this.listCn = await this.chuyenNganhService.getAll();
    this.listDotDk = await this.dotDkService.getAll();

    if (this.listDotDk.length > 0) {
      this._namHoc = this.listDotDk[0].namHoc;
      this._dot = this.listDotDk[0].dot;
    }

    await this.getAll();

    this.websocketService.startConnection();
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.getAll();
      }
    });
  }

  async getAll() {
    console.log('api', this._maCn, this._namHoc, this._dot)
    this.listSv = await this.thamGiaService.SearchInfo(
      '',
      this._maCn,
      true,
      this._namHoc,
      this._dot
    );
    this.onSearchChange();
  }

  onSearchChange() {
    if (this._searchName) {
      let value = this._searchName.toLowerCase();
      this.temps = this.listSv.filter(
        (t) =>
          t.maSV.toLowerCase().includes(value) ||
          t.tenSV.toLowerCase().includes(value) ||
          t.lop.toLowerCase().includes(value) ||
          t.chuyenNganh.toLowerCase().includes(value)
      );
    } else {
      this.temps = this.listSv;
    }
  }

  getThamgiaByMaCN(event: any) {
    this._maCn = event.target.value;
    this.getAll();
  }

  getSinhvienByNotDotDk(event: any) {
    let value = event.target.value;
    this._namHoc = value.slice(0, value.length - 1);
    this._dot = +value[value.length - 1];
    this.getAll();
  }

  async onDelete(maSv: string, namHoc: string, dot: number) {
    try {
      await this.thamGiaService.delete(maSv, namHoc, dot);
      this.toastService.success('Xóa thành công!', 'Thông báo!');
    } catch (error) {
      this.toastService.error(
        'Không thể xóa sinh viên này khỏi đợt đăng ký!',
        'Thông báo !'
      );
    }
  }

  async addThamgia() {
    for (let maSv of this.selectedSV) {
      let sv = await this.sinhVienService.getById(maSv);
      await this.f_AddThamgia(sv);
    }
  }

  toggleAddAll(event: any) {
    const element = event.target;
    const parent: any = getParentElement(element, '.table');
    const child = parent.querySelectorAll('.add-btn');

    if (!element.classList.contains('active')) {
      this.selectedSV = [];
      child.forEach((item: any) => {
        const parent = getParentElement(item, '.br-line');
        const firstElement = parent.firstChild;

        this.selectedSV.push(firstElement.innerHTML);
        item.firstChild.classList.remove('none');
      });
      element.classList.add('active');
    } else {
      this.selectedSV = [];
      child.forEach((item: any) => {
        if (!item.firstChild.classList.contains('none')) {
          item.firstChild.classList.add('none');
        }
      });
      element.classList.remove('active');
    }
  }

  toggleAdd(event: any) {
    try {
      const element = event.target;
      const parent = getParentElement(element, '.br-line');
      const firstElement = parent.firstChild;

      element.firstChild.classList.contains('none');

      this.selectedSV.push(firstElement.innerHTML);

      element.firstChild.classList.remove('none');
    } catch {
      const element = getParentElement(event.target, '.add-btn');
      const parent = getParentElement(element, '.br-line');
      const firstElement = parent.firstChild;

      let index = this.selectedSV.findIndex(
        (t) => t === firstElement.innerHTML
      );
      this.selectedSV.splice(index, 1);

      element.firstChild.classList.add('none');
    }
  }

  async f_AddThamgia(sv: SinhVien) {
    try {
      const nhom = new Nhom();
      const maNhom = sv.maSv + this._namHoc + this._dot;
      nhom.init(maNhom, sv.tenSv);
      await this.nhomService.add(nhom);

      const thamgia = new ThamGia();
      thamgia.init(sv.maSv, this._namHoc, this._dot, maNhom, 0, true);
      await this.thamGiaService.add(thamgia);

      this.websocketService.sendForThamGia(true);

      this.toastService.success(
        'Thêm sinh viên vào đợt đợt đăng ký thành công',
        'Thông báo !'
      );
    } catch (error) {
      this.toastService.error(
        'Thêm sinh viên vào đợt đợt đăng ký thất bại',
        'Thông báo !'
      );
    }
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}

