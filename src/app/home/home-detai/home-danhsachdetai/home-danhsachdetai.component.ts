import { dotDkService } from './../../../services/dotDk.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { deTai_chuyenNganhService } from './../../../services/deTai_chuyenNganh.service';
import { chuyenNganhService } from './../../../services/chuyenNganh.service';
import { duyetDtService } from './../../../services/duyetDt.service';
import { DuyetDt } from '../../../models/DuyetDt.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { DeTai_ChuyenNganh } from '../../../models/DeTai_ChuyenNganh.model';
import { giangVienService } from '../../../services/giangVien.service';
import { RaDe } from '../../../models/RaDe.model';
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
import { HomeMainComponent } from '../../home-main/home-main.component';
import { DotDk } from 'src/app/models/DotDk.model';

@Component({
  selector: 'app-home-danhsachdetai',
  templateUrl: './home-danhsachdetai.component.html',
  styleUrls: ['./home-danhsachdetai.component.scss'],
})
export class HomeDanhsachdetaiComponent {
  searchName = '';
  @Input() isSelectedDT = false;
  @Output() returnIsSelectedDT = new EventEmitter<boolean>();
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;
  _chucVu = 0;

  listDT: DeTai[] = [];
  selectedDT: string[] = [];
  lineDT = new DeTai();
  elementOld: any;

  listDetai: DeTai[] = [];
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

  _ListCn: string[] = ['CNPM', 'MMT', 'KHPTDL', 'HTTT'];

  constructor(
    private deTaiService: deTaiService,
    private elementRef: ElementRef,
    private shareService: shareService,
    private raDeService: raDeService,
    private duyetDtService: duyetDtService,
    private giangVienService: giangVienService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private titleService: Title,
    private toastr: ToastrService,
    private chuyenNganhService: chuyenNganhService,
    private dotDkService: dotDkService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách đề tài');
    if (HomeMainComponent.maKhoa && HomeMainComponent.maBm) {
      this._chucVu = 3;
    } else if (HomeMainComponent.maKhoa) {
      this._chucVu = 2;
    } else if (HomeMainComponent.maBm) {
      this._chucVu = 1;
    }

    this.listCn = await this.chuyenNganhService.getAll();

    this.listDotdk = await this.dotDkService.getAll();
    await this.getAllDeTai();

    this.listDetai = await this.deTaiService.getAll();
    this.listRade = await this.raDeService.getAll();
    this.listDuyetDt = await this.duyetDtService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();

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

  onDropFile(event: any) {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    this.readExcelFile(file);
  }

  onFileInput(event: any) {
    let file = event.target.files[0];

    this.readExcelFile(file);
  }

  readExcelFile(file: any) {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (event) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const workBook = XLSX.read(data, { type: 'array' });
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const datas = excelData
        .slice(1, excelData.length)
        .filter((data: any) => data.length > 0);

      datas.forEach((data: any, i) => {
        data[1] = `<p>${data[1].replaceAll('\r\n', ' ')}</p>`;
        data[2] = data[2].split('\r\n');
        data[2] = data[2].map((line: string) => `<p>${line}</p>`);

        data[2] = data[2].join('');
      });
      this.deTaiFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + 'MB',
        data: datas,
      };
    };
  }

  onSelect() {
    let input = this.elementRef.nativeElement.querySelector(
      '#drag-file_box input[type=file]'
    );

    input.click();
  }

  onCloseDrag(event: any) {
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    event.target.classList.remove('active');
    dragBox.classList.remove('active');
  }

  async createDeTai(data: any) {
    let deTai = new DeTai();
    // let maDT = await this.deTaiService.createMaDT('CNTT');
    deTai.init(
      '',
      data[1] ? data[1] : '',
      data[2] ? data[2] : '',
      data[3] ? data[3] : '',
      data[4] ? data[4] : '',
      shareService.namHoc,
      shareService.dot
    );
    let dt = await this.deTaiService.add(deTai);
    return dt.maDT;
  }

  async createRaDe(maDT: string) {
    let raDe = new RaDe();
    raDe.init(HomeMainComponent.maGV, maDT);
    await this.raDeService.add(raDe);
  }

  async createChuyenNganh_DeTai(listCns: any, maDT: string) {
    let deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];
    let chuyenNganhs = listCns
      .split(',')
      .map((t: any) => this.shareService.removeSpace(t));
    chuyenNganhs.forEach((item: any) => {
      let deTaiChuyenNganh = new DeTai_ChuyenNganh();
      deTaiChuyenNganh.init(item, maDT);
      deTaiChuyenNganhs.push(deTaiChuyenNganh);
    });
    deTaiChuyenNganhs.forEach(async (item) => {
      await this.deTai_chuyenNganhService.add(item);
    });
  }

  async onReadFile() {
    if (this.deTaiFile.data.length > 0) {
      const datas = this.deTaiFile.data;

      for (var data of datas) {
        try {
          var maDT = await this.createDeTai(data);

          await this.createRaDe(maDT);

          await this.createChuyenNganh_DeTai(data[5], maDT);
          this.websocketService.sendForDeTai(true);

          this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
        } catch (error) {
          this.toastr.error('Thêm đề tài thất bại', 'Thông báo !');
        }
      }
    }
  }

  onShowFormDrag() {
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
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

  getTrangthaiDetai(maDT: string) {
    let detai: DeTai =
      this.listDT.find((item) => item.maDT == maDT) ?? new DeTai();
    // console.log(maDT + ": " + detai.trangThai);
    return detai.trangThai;
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
