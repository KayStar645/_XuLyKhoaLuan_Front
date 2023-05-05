import { thamGiaService } from './../../../services/thamGia.service';
import { ThamGia } from './../../../models/ThamGia.model';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-danhsachsinhvien',
  templateUrl: './home-danhsachsinhvien.component.html',
})
export class HomeDanhsachsinhvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedTG = false;
  @Output() returnIsSelectedTG = new EventEmitter<boolean>();
  listTg: ThamGia[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
    private thamGiaService: thamGiaService
  ) {}

  async ngOnInit() {
    this.listSV = await this.sinhVienService.getAll();
    this.getAllThamgiaByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();

    
  }

  async getAllSinhVien() {
    
  }

  async getAllThamgiaByDotdk() {
    this.listTg = await this.thamGiaService.getAll();
    this.root = this.listTg;
  }

  async getThamgiaByMaCN(maCn: string) {
    this.listTg = await this.thamGiaService.getByCn(maCn);
  }

  getThamgiaByDotDk(namHoc: string, dot: number) {
    this.listTg =
      this.root.filter((t) => t.namHoc == namHoc && t.dot == dot) || [];
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      const name = this.searchName.trim().toLowerCase();
      if (name == '') {
        this.listTg = this.root;
      } else {
        this.listTg = await this.thamGiaService.searchThamgiaByName(name);
      }
    }
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