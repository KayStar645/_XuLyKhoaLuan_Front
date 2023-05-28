import { dotDkService } from './../../../services/dotDk.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import {
  Component,
  OnInit,
} from '@angular/core';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { SinhVienVT } from 'src/app/models/VirtualModel/SinhVienVTModel';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DotDk } from 'src/app/models/DotDk.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ministry-danhsachthamgia',
  templateUrl: './ministry-danhsachthamgia.component.html',
})
export class MinistryDanhsachthamgiaComponent implements OnInit {
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;

  listSv: SinhVienVT[] = [];
  temps: SinhVienVT[] = [];

  listCn: ChuyenNganh[] = [];
  listDotDk: DotDk[] = [];

  constructor(
    private shareService: shareService,
    private websocketService: WebsocketService,
    private thamGiaService: thamGiaService,
    private chuyenNganhService: chuyenNganhService,
    private dotDkService: dotDkService,
    private toastService: ToastrService
  ) {}

  async ngOnInit() {
    await this.getAll();

    this.listCn = await this.chuyenNganhService.getAll();
    this.listDotDk = await this.dotDkService.getAll();

    this.websocketService.startConnection();
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.getAll();
      }
    });
  }

  async getAll() {
    this.listSv = await this.thamGiaService.SearchInfo(
      "",
      this._maCn,
      false,
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
          t.email.toLowerCase().includes(value) ||
          t.gioiTinh.toLowerCase().includes(value) ||
          t.sdt.toLowerCase().includes(value) ||
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

  getThamgiaByDotDk(event: any) {
    let value = event.target.value;
    if (value) {
      this._namHoc = value.slice(0, value.length - 1);
      this._dot = +value[value.length - 1];
    }
    else {
      this._namHoc = "";
      this._dot = 0;
    }
    this.getAll();
  }

  async onDelete(maSv: string, namHoc: string, dot: number) {
    try {
      await this.thamGiaService.delete(maSv, namHoc, dot);
      this.websocketService.sendForThamGia(true);
      this.toastService.success('Xóa thành công!', 'Thông báo!');
    } catch (error) {
      this.toastService.error(
        'Không thể xóa sinh viên này khỏi đợt đăng ký!',
        'Thông báo !'
      );
    }
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
