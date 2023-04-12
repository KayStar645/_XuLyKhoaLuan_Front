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
  listDT: DeTai[] = [];
  root: DeTai[] = [];
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

    this.listCn = await this.chuyenNganhService.getAll();

    this.listDotdk = await this.dotDkService.getAll();
    this.getAllDeTai();

    this.listDetai = await this.deTaiService.getAll();
    this.listRade = await this.raDeService.getAll();
    this.listDuyetDt = await this.duyetDtService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();

    this.tenDT.pipe(debounceTime(800)).subscribe((tenDT) => {
      if (tenDT) {
        this.listDT = this.root.filter((item) =>
          item.tenDT.toLowerCase().includes(tenDT)
        );
      } else {
        this.listDT = this.root;
      }
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

  async getDetaiByMaCnMaGv(maCn: string, maGV: string) {
    if (HomeMainComponent.maBm != '') {
      // Lấy đề tài theo chuyên ngành của bộ môn mình
      this.listDT = await this.deTaiService.GetDetaiByChuyenNganhBomon(
        maCn,
        HomeMainComponent.maBm
      );
    } else {
      this.listDT = await this.deTaiService.GetDeTaisByChuyennganhGiangvien(
        maCn,
        maGV
      );
    }
  }

  async getDetaiByDotdk(namHoc: string, dot: number) {}

  onGetDetaiByMaCn(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.getAllDeTai();
    } else {
      this.getDetaiByMaCnMaGv(maCn, HomeMainComponent.maGV);
    }
  }

  onGetDotdk(event: any) {
    const dotdk = event.target.value;
    let namHoc = dotdk.slice(0, dotdk.length - 1);
    let dot = dotdk.slice(dotdk.length - 1);

    if (dotdk == '') {
      this.getAllDeTai();
    } else {
      this.getDetaiByDotdk(namHoc, dot);
    }
  }

  async sortGiangVien(event: any) {
    const sort = event.target.value;

    if (sort == 'asc-id') {
      this.listDT.sort((a, b) => a.maDT.localeCompare(b.maDT));
    } else if (sort == 'desc-id') {
      this.listDT.sort((a, b) => b.maDT.localeCompare(a.maDT));
    } else if (sort == 'asc-name') {
      this.listDT.sort((a, b) => a.tenDT.localeCompare(b.tenDT));
    } else if (sort == 'desc-name') {
      this.listDT.sort((a, b) => b.tenDT.localeCompare(a.tenDT));
    } else {
      this.getAllDeTai();
    }
  }

  // getThamgiaByDotDk(event: any) {
  //   const dotdk = event.target.value;
  //   if (dotdk == '') {
  //     this.DSTGComponent.getAllThamgiaByDotdk();
  //   } else {
  //     this.namHoc = dotdk.slice(0, dotdk.length - 1);
  //     this.dot = dotdk.slice(dotdk.length - 1);
  //     this.DSTGComponent.getThamgiaByDotDk(this.namHoc, this.dot);
  //   }
  // }

  async getAllDeTai() {
    const maKhoa = HomeMainComponent.maKhoa;
    const maBm = HomeMainComponent.maBm;
    const maGv = HomeMainComponent.maGV;
    if (maKhoa != null) {
      this.listDT = await this.deTaiService.GetAllDeTaisByMakhoa(maKhoa);
    } else if (maBm != null) {
      this.listDT = await this.deTaiService.GetAllDeTaisByMaBomon(maBm, false);
    } else {
      this.listDT = await this.deTaiService.GetAllDeTaisByGiangvien(maGv);
    }
    this.root = this.listDT;
  }

  getTenChuyennganhByMaDT(maDT: string) {
    let result = [];
    let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);

    for (let item of dtcns) {
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
    return detai.trangThai;
  }

  onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this.tenDT.next(searchName);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listDT = this.root.filter((item) =>
      item.tenDT.toLowerCase().includes(searchName)
    );
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
