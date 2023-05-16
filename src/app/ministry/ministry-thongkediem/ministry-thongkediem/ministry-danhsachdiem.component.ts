import { deTaiDiemService } from '../../../services/NghiepVu/detaidiem.service';
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

    this.websocketService.startConnection();
    this.websocketService.receiveFromSinhVien(async (dataChange: boolean) => {
      if (dataChange) {
        this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
          this._keyword,
          this._maCn,
          this._namHoc,
          this._dot
        );
      }
    });
  }

  async getSinhVienByMaCN(maCn: string) {
    this._maCn = maCn;
    this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
      this._keyword,
      this._maCn,
      this._namHoc,
      this._dot
    );
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
  }

  // async ngOnChanges(changes: SimpleChanges) {
  //   if (changes.keyword) {
  //     const keyword = this.keyword.trim().toLowerCase();
  //     this._keyword = keyword;
  //     this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
  //       this._keyword,
  //       this._maCn,
  //       this._namHoc,
  //       this._dot
  //     );
  //   }
  // }

  async updateData(keyword: string) {
    this._keyword = keyword;
    this.listSV = await this.deTaiDiemService.GetDanhSachDiem(
      this._keyword,
      this._maCn,
      this._namHoc,
      this._dot
    );
  }
}
