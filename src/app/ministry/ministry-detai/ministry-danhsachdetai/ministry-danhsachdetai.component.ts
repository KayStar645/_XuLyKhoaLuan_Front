import { dotDkService } from './../../../services/dotDk.service';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { DeTai_ChuyenNganh } from '../../../models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from '../../../services/deTai_chuyenNganh.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { giangVienService } from '../../../services/giangVien.service';
import { duyetDtService } from '../../../services/duyetDt.service';
import { raDeService } from '../../../services/raDe.service';
import {
  Component,
} from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DotDk } from 'src/app/models/DotDk.model';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { DetaiVT } from 'src/app/models/VirtualModel/DetaiVTModel';
import { GiangVienVT } from 'src/app/models/VirtualModel/GiangVienVTModel';

@Component({
  selector: 'app-ministry-danhsachdetai',
  templateUrl: './ministry-danhsachdetai.component.html',
  styleUrls: ['./ministry-danhsachdetai.component.scss'],
})
export class MinistryDanhsachdetaiComponent {
  searchName = '';
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;
  _chucVu = -1;

  _ListCn: string[] = ['CNPM', 'MMT', 'KHPTDL', 'HTTT'];

  listDT: DetaiVT[] = [];

  listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
  listChuyennganh: ChuyenNganh[] = [];

  dtUpdate: any = DeTai;
  deTaiFile: any;
  listCn: ChuyenNganh[] = [];
  listDotdk: DotDk[] = [];

  dtAddForm: any;
  dtUpdateForm: any;
  dtOldForm: any;

  dtForm = new Form();

  exceptInput = ['slMin', 'slMax'];

  tenDT = new Subject<string>();

  constructor(
    private deTaiService: deTaiService,
    private shareService: shareService,
    private raDeService: raDeService,
    private duyetDtService: duyetDtService,
    private giangVienService: giangVienService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private titleService: Title,
    private chuyenNganhService: chuyenNganhService,
    private websocketService: WebsocketService,
    private dotDkService: dotDkService
  ) {}

  async ngOnInit() {
    this.listCn = await this.chuyenNganhService.getAll();

    this.listDotdk = await this.dotDkService.getAll();
    await this.getAllDeTai();

    this.websocketService.startConnection();
    this.websocketService.receiveFromDeTai((dataChange: boolean) => {
      if (dataChange) {
        this.getAllDeTai();
      }
    });
  }

  onDragFileEnter(event: any) {
    event.preventDefault();
    const parent = getParentElement(event.target, '.drag-form');

    parent.classList.add('active');
  }

  onDragFileOver(event: any) {
    event.preventDefault();
    event.target.classList.add('active');
  }

  onDragFileLeave(event: any) {
    event.preventDefault();
    event.target.classList.remove('active');
  }

  async onGetDetaiByMaCn(event: any) {
    const maCn = event.target.value;
    this._maCn = maCn;
    await this.getAllDeTai();
  }

  async onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this._searchName = searchName;
    await this.getAllDeTai();
  }

  async onGetDotdk(event: any) {
    const dotdk = event.target.value;
    this._namHoc = dotdk.slice(0, dotdk.length - 1);
    this._dot = dotdk.slice(dotdk.length - 1);

    await this.getAllDeTai();
  }

  async getAllDeTai() {
    this.listDT = await this.deTaiService.search(
      this._searchName,
      HomeMainComponent.maBm,
      HomeMainComponent.maGV,
      this._namHoc,
      this._dot,
      false,
      this._chucVu
    );
  }

  async getDetaiByMaCn(maBM: string) {
    this.listDT = await this.deTaiService.search(
      this._searchName,
      maBM,
      HomeMainComponent.maGV,
      this._namHoc,
      this._dot,
      false,
      this._chucVu
    );
  }

  getCnPhuhop(cnPhuHop: ChuyenNganh[]) {
    let result = [];
    let count = 0;
    if (cnPhuHop.length >= 4) {
      for (let cn of cnPhuHop) {
        if (this._ListCn.includes(cn.maCn)) {
          count++;
        }
      }
    }
    if (count == 4) {
      result.push('Công nghệ thông tin');
    }
    for (let item of cnPhuHop) {
      if (count == 4 && this._ListCn.includes(item.maCn)) {
        continue;
      }
      result.push(this.listChuyennganh.find((c) => c.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  getGvrd(gvrd: GiangVienVT[]) {
    return gvrd.map((re) => re.tenGV);
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
