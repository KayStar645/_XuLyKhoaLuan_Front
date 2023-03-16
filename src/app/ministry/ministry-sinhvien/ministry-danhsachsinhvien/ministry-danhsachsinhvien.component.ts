import { thamGiaService } from './../../../services/thamGia.service';
import { thamGiaHdService } from './../../../services/thamGiaHD.service';
import { ThamGia } from './../../../models/ThamGia.model';
import { dotDkService } from './../../../services/dotDk.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';

@Component({
  selector: 'app-danhsachsinhvien',
  templateUrl: './ministry-danhsachsinhvien.component.html',
  styleUrls: ['./ministry-danhsachsinhvien.component.scss'],
})
export class MinistryDanhsachsinhvienComponent implements OnInit {
  @Input() searchName = '';
  listTg: ThamGia[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  //root: SinhVien[] = [];
  lineSV = new SinhVien();
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
  ) {}

  async ngOnInit() {
    this.getAllSinhVien();
    this.getAllSinhVienByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();
  }

  async clickLine(event: any) {
    const element = event.target.parentNode;
    if (this.elementOld == element && this.lineSV.maSv != null) {
      this.elementOld.classList.remove('br-line-hover');
      this.lineSV = new SinhVien();
    } else {
      if (this.elementOld != null) {
        this.elementOld.classList.remove('br-line-hover');
      }

      element.classList.add('br-line-hover');
      this.elementOld = element;

      const mgv = element.firstElementChild.innerHTML;
      this.lineSV = await this.sinhVienService.getById(mgv);
    }
  }

  async getAllSinhVien() {
    this.listSV = await this.sinhVienService.getAll();
    console.log(this.listSV);
  }

  async getAllSinhVienByDotdk() {
    this.listTg = await this.thamGiaService.getAll();
    this.root = this.listTg;
  }

  async getSinhVienByMaCN(maCn: string) {
    this.listTg = await this.thamGiaService.getByCn(maCn);
  }

  getSinhVienByDotDk(namHoc: string, dot:  number) {
    this.listTg = this.root.filter((t) => t.namHoc == namHoc && t.dot == dot) || [];
  }

  async sortSinhVien(sort: string) {
    if (sort == 'asc-id') {
      this.listSV.sort((a, b) => a.maSv.localeCompare(b.maSv));
    } else if (sort == 'desc-id') {
      this.listSV.sort((a, b) => b.maSv.localeCompare(a.maSv));
    } else if (sort == 'asc-name') {
      this.listSV.sort((a, b) => a.tenSv.localeCompare(b.tenSv));
    } else if (sort == 'desc-name') {
      this.listSV.sort((a, b) => b.tenSv.localeCompare(a.tenSv));
    } else if (sort == 'asc-subject') {
      this.listSV.sort((a, b) => a.maCn.localeCompare(b.maCn));
    } else if (sort == 'desc-subject') {
      this.listSV.sort((a, b) => b.maCn.localeCompare(a.maCn));
    } else {
      this.listSV = await this.sinhVienService.getAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listTg = this.root.filter((item) => {
      console.log("117 - danh sách sinh viên");
        // item.tenSv.toLowerCase().includes(searchName)
    }
    );
  }

  getTenCNById(maCn: string): string {
    let tencn: any = '';

    if (this.listCN) {
      tencn = this.listCN.find((t) => t.maCn === maCn)?.tenCn;
    }
    return tencn;
  }

  getSinhVienById(maSV: string) {
    this.sinhVien = this.listSV.find((t) => t.maSv === maSV) ?? this.sinhVien;
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
