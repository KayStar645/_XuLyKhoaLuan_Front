import { deTaiDiemService } from '../../../services/NghiepVu/detaidiem.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DiemSVVT } from 'src/app/models/VirtualModel/DiemSVVTModel';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';

@Component({
  selector: 'app-ministry-danhsachdiem',
  templateUrl: './ministry-danhsachdiem.component.html',
})
export class MinistryDanhsachdiemComponent implements OnInit {
  _keyword = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;

  listCN: ChuyenNganh[] = [];
  listSV: DiemSVVT[] = [];
  temps: DiemSVVT[] = [];

  constructor(
    private chuyenNganhService: chuyenNganhService,
    private deTaiDiemService: deTaiDiemService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.listCN = await this.chuyenNganhService.getAll();

    this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
      this._keyword,
      this._maCn,
      this._namHoc,
      this._dot
    );

    this.temps = this.listSV;

    await this.Websocket();
  }

  async getSinhVienByMaCN(maCn: string) {
    this._maCn = maCn;
    this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
      this._keyword,
      this._maCn,
      this._namHoc,
      this._dot
    );
    this.temps = this.listSV;
  }

  async getSinhVienByDotdk(dotdk: string) {
    this._namHoc = '';
    this._dot = 0;
    if (dotdk != '') {
      this._namHoc = dotdk.slice(0, dotdk.length - 1);
      this._dot = parseInt(dotdk.slice(dotdk.length - 1));
    }

    this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
      this._keyword,
      this._maCn,
      this._namHoc,
      this._dot
    );
    this.temps = this.listSV;
  }

  async updateData(keyword: string) {
    this._keyword = keyword;

    if (keyword) {
      this.temps = this.listSV.filter(
        (t) =>
          t.tenSv.includes(keyword) ||
          t.maSv.includes(keyword) ||
          t.chuyenNganh.includes(keyword) ||
          t.lop.includes(keyword)
      );
    } else {
      this.temps = this.listSV;
    }
    this.temps = this.listSV;
  }

  async Websocket() {
    this.websocketService.startConnection();
    this.websocketService.receiveFromHuongDanCham(
      async (dataChange: boolean) => {
        if (dataChange) {
          this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
            this._keyword,
            this._maCn,
            this._namHoc,
            this._dot
          );
        }
      }
    );
    this.websocketService.receiveFromPhanBienCham(
      async (dataChange: boolean) => {
        if (dataChange) {
          this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
            this._keyword,
            this._maCn,
            this._namHoc,
            this._dot
          );
        }
      }
    );

    this.websocketService.receiveFromHoiDongPhanBien(
      async (dataChange: boolean) => {
        if (dataChange) {
          this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
            this._keyword,
            this._maCn,
            this._namHoc,
            this._dot
          );
        }
      }
    );
    this.temps = this.listSV;
  }
}
