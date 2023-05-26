import { Component, ElementRef, OnInit } from '@angular/core';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { ToastrService } from 'ngx-toastr';
import { WebsocketService } from '../../../services/Websocket.service';
import { chuyenNganhService } from '../../../services/chuyenNganh.service';
import { getParentElement } from '../../../../assets/utils';
import { SinhVien } from '../../../models/SinhVien.model';
import { Nhom } from '../../../models/Nhom.model';
import { ThamGia } from '../../../models/ThamGia.model';
import { nhomService } from '../../../services/nhom.service';
import { sinhVienService } from '../../../services/sinhVien.service';
import { DotDk } from '../../../models/DotDk.model';
import { dotDkService } from '../../../services/dotDk.service';
import { thamGiaService } from '../../../services/thamGia.service';

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

  listChuyenNganh: ChuyenNganh[] = [];
  listSinhVien: SinhVien[] = [];
  selectedSV: any[] = [];
  listDotDk: DotDk[] = [];
  namHoc!: string;
  dot!: number;
  selectedChuyenNganh!: string;

  constructor(
    private chuyenNganhService: chuyenNganhService,
    private toastr: ToastrService,
    private nhomService: nhomService,
    private sinhVienService: sinhVienService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit(): Promise<void> {
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    this.listDotDk = await this.dotDkService.getAll();

    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }

    if (this.listDotDk.length > 0) {
      this.namHoc = this.listDotDk[0].namHoc;
      this.dot = this.listDotDk[0].dot;
    }

    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );

    this.websocketService.startConnection();
    this.websocketService.receiveFromDotDangKy(async (dataChange: boolean) => {
      if (dataChange) {
        this.listSinhVien = await this.sinhVienService.getByDotDk(
          this.namHoc,
          this.dot,
          false
        );
      }
    });
  }

  async addThamgia() {
    for (let maSv of this.selectedSV) {
      let sv = await this.sinhVienService.getById(maSv);
      await this.f_AddThamgia(sv);
    }
    await this.resetList();
  }

  async resetList() {
    this.listDotDk = await this.dotDkService.getAll();
    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );
  }

  async getSinhvienByNotDotDk(event: any) {
    const dotdk = event.target.value;
    this.namHoc = dotdk.slice(0, dotdk.length - 1);
    this.dot = dotdk.slice(dotdk.length - 1);
    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );
  }

  async getSinhvienByMaCN(event: any) {
    const maCn = event.target.value;

    if (maCn) {
      this.listSinhVien = await this.sinhVienService.getByMaCn(maCn);
    } else {
      this.listSinhVien = await this.sinhVienService.getAll();
    }
  }

  getTenCnById(maCn: string) {
    return this.listChuyenNganh.find((t) => t.maCn === maCn)?.tenCn;
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
      const maNhom = sv.maSv + this.namHoc + this.dot;
      nhom.init(maNhom, sv.tenSv);
      await this.nhomService.add(nhom);

      const thamgia = new ThamGia();
      thamgia.init(sv.maSv, this.namHoc, this.dot, maNhom, 0, true);
      await this.thamGiaService.add(thamgia);

      this.websocketService.sendForThamGia(true);

      this.toastr.success(
        'Thêm sinh viên vào đợt đợt đăng ký thành công',
        'Thông báo !'
      );
    } catch (error) {
      this.toastr.error(
        'Thêm sinh viên vào đợt đợt đăng ký thất bại',
        'Thông báo !'
      );
    }
  }
}
