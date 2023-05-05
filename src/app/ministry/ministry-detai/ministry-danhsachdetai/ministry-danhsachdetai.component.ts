import { dotDkService } from './../../../services/dotDk.service';
import { DuyetDt } from '../../../models/DuyetDt.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { DeTai_ChuyenNganh } from '../../../models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from '../../../services/deTai_chuyenNganh.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { giangVienService } from '../../../services/giangVien.service';
import { RaDe } from '../../../models/RaDe.model';
import { duyetDtService } from '../../../services/duyetDt.service';
import { raDeService } from '../../../services/raDe.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { debounceTime, Subject } from 'rxjs';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DotDk } from 'src/app/models/DotDk.model';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';

@Component({
  selector: 'app-ministry-danhsachdetai',
  templateUrl: './ministry-danhsachdetai.component.html',
  styleUrls: ['./ministry-danhsachdetai.component.scss'],
})
export class MinistryDanhsachdetaiComponent {
  searchName = '';
  @Input() isSelectedDT = false;
  @Output() returnIsSelectedDT = new EventEmitter<boolean>();
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;
  _chucVu = -1;

  _ListCn: string[] = ['CNPM', 'MMT', 'KHPTDL', 'HTTT'];

  listDT: DeTai[] = [];
  root: DeTai[] = [];
  selectedDT: string[] = [];
  lineDT = new DeTai();
  elementOld: any;

  listRade: RaDe[] = [];
  listDuyetDt: DuyetDt[] = [];
  listGiangvien: GiangVien[] = [];
  listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
  listChuyennganh: ChuyenNganh[] = [];

  dtUpdate: any = DeTai;
  selectedBomon!: string;
  deTaiFile: any;
  listCn: ChuyenNganh[] = [];
  listDotdk: DotDk[] = [];

  dtAddForm: any;
  dtUpdateForm: any;
  dtOldForm: any;
  isSummary: boolean = false;
  isTrangThai: boolean = false;

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
    this.getAllDeTai();

    this.listRade = await this.raDeService.getAll();
    this.listDuyetDt = await this.duyetDtService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();

    this.tenDT.pipe(debounceTime(800)).subscribe((tenDT) => {
      this.deTaiService.getAll().then((data) => {
        if (tenDT) {
          this.listDT = data.filter((item) =>
            item.tenDT.toLowerCase().includes(tenDT)
          );
        } else {
          this.listDT = data;
        }
      });
    });

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

  getTrangthaiDetai(maDT: string) {
    let detai: DeTai =
      this.listDT.find((item) => item.maDT == maDT) ?? new DeTai();
    return detai.trangThai;
  }

  async onGetDetaiByMaCn(event: any) {
    const maCn = event.target.value;
    this._maCn = maCn;
    this.listDT = await this.deTaiService.search(
      this._maCn,
      this._searchName,
      this._namHoc,
      this._dot,
      HomeMainComponent.maBm,
      HomeMainComponent.maGV,
      this._chucVu
    );
  }

  async onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this._searchName = searchName;
    this.listDT = await this.deTaiService.search(
      this._maCn,
      this._searchName,
      this._namHoc,
      this._dot,
      HomeMainComponent.maBm,
      HomeMainComponent.maGV,
      this._chucVu
    );
  }

  async onGetDotdk(event: any) {
    const dotdk = event.target.value;
    this._namHoc = dotdk.slice(0, dotdk.length - 1);
    this._dot = dotdk.slice(dotdk.length - 1);

    this.listDT = await this.deTaiService.search(
      this._maCn,
      this._searchName,
      this._namHoc,
      this._dot,
      HomeMainComponent.maBm,
      HomeMainComponent.maGV,
      this._chucVu
    );
  }

  async getAllDeTai() {
    this.listDT = await this.deTaiService.search(
      this._maCn,
      this._searchName,
      this._namHoc,
      this._dot,
      HomeMainComponent.maBm,
      HomeMainComponent.maGV,
      this._chucVu
    );
  }

  async getDetaiByMaCn(maCn: string) {
    this.listDT = await this.deTaiService.getByChuyenNganh(maCn);
  }

  getTenChuyennganhByMaDT(maDT: string) {
    let result = [];
    let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);
    let count = 0;
    if (dtcns.length >= 4) {
      for (let cn of dtcns) {
        if (this._ListCn.includes(cn.maCn)) {
          count++;
        }
      }
    }
    if (count == 4) {
      result.push('Công nghệ thông tin');
    }
    for (let item of dtcns) {
      if (count == 4 && this._ListCn.includes(item.maCn)) {
        continue;
      }
      result.push(this.listChuyennganh.find((c) => c.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  getTenGvRadeByMaDT(maDT: string) {
    let result = [];
    let rades = this.listRade.filter((item) => item.maDt == maDT);
    // rades.forEach(item => result.push(this.listGiangvien.find(g => g.maGv == item.maGv)?.tenGv));
    for (let item of rades) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getTenGvDuyetByMaDT(maDT: string) {
    let result = [];
    let duyetdts = this.listDuyetDt.filter((item) => item.maDt == maDT);
    for (let item of duyetdts) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getThoiGianDuyetByMaDT(maDT: string) {
    let duyetdts = this.listDuyetDt.filter((item) => item.maDt == maDT);
    if (duyetdts.length > 0) {
      const date = duyetdts.reduce((max, duyetdt) => {
        return new Date(duyetdt?.ngayDuyet) > max
          ? new Date(duyetdt?.ngayDuyet)
          : max;
      }, new Date(duyetdts[0]?.ngayDuyet));
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return '';
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
