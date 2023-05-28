import { dotDkService } from './../../../services/dotDk.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { deTai_chuyenNganhService } from './../../../services/deTai_chuyenNganh.service';
import { chuyenNganhService } from './../../../services/chuyenNganh.service';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { DeTai_ChuyenNganh } from '../../../models/DeTai_ChuyenNganh.model';
import { RaDe } from '../../../models/RaDe.model';
import { raDeService } from '../../../services/raDe.service';
import { Component, ElementRef } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import {  getParentElement, Option } from 'src/assets/utils';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { DotDk } from 'src/app/models/DotDk.model';
import { DetaiVT } from 'src/app/models/VirtualModel/DetaiVTModel';
import { GiangVienVT } from 'src/app/models/VirtualModel/GiangVienVTModel';

@Component({
  selector: 'app-home-danhsachdetai',
  templateUrl: './home-danhsachdetai.component.html',
  styleUrls: ['./home-danhsachdetai.component.scss'],
})
export class HomeDanhsachdetaiComponent {
  _searchName = '';
  _namHoc = '';
  _dot = 0;
  _chucVu = 0;

  listDT: DetaiVT[] = [];
  
  listChuyennganh: ChuyenNganh[] = [];

  dtUpdate: any = DeTai;
  selectedBomon!: string;
  deTaiFile: any;
  listDotdk: DotDk[] = [];

  dtAddForm: any;
  dtUpdateForm: any;
  dtOldForm: any;



  _ListCn: string[] = ['CNPM', 'MMT', 'KHPTDL', 'HTTT'];

  constructor(
    private deTaiService: deTaiService,
    private elementRef: ElementRef,
    private shareService: shareService,
    private raDeService: raDeService,
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

    this.listDotdk = await this.dotDkService.getAll();
    await this.getAllDeTai();

    this.listChuyennganh = await this.chuyenNganhService.getAll();

    this.websocketService.startConnection();
    this.websocketService.receiveFromDeTai((dataChange: boolean) => {
      if (dataChange) {
        console.log('websocketService');
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

  async onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this._searchName = searchName;
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

  async onGetDotdk(event: any) {
    const dotdk = event.target.value;
    this._namHoc = dotdk.slice(0, dotdk.length - 1);
    this._dot = dotdk.slice(dotdk.length - 1);

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

  // getGvrd(gvrd: GiangVienVT[]) {
  //   return gvrd.map((re) => re.tenGv);
  // }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
