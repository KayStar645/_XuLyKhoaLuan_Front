import { TruongBm } from './../../../models/TruongBm.model';
import { TruongKhoa } from './../../../models/TruongKhoa.model';
import { truongBmService } from './../../../services/truongBm.service';
import { truongKhoaService } from './../../../services/truongKhoa.service';
import { HomeMainComponent } from './../../home-main/home-main.component';
import { shareService } from '../../../services/share.service';
import { giangVienService } from '../../../services/giangVien.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { boMonService } from 'src/app/services/boMon.service';
import { BoMon } from 'src/app/models/BoMon.model';

@Component({
  selector: 'app-home-danhsachgiangvien',
  templateUrl: './home-danhsachgiangvien.component.html',
  // styleUrls: ['./home-danhsachgiangvien.component.scss']
})
export class HomeDanhsachgiangvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedGV = false;
  @Output() returnIsSelectedGV = new EventEmitter<boolean>();
  listBM: BoMon[] = [];
  root: GiangVien[] = [];
  lineGV = new GiangVien();
  elementOld: any;
  selectedGV: string[] = [];
  listGV: GiangVien[] = [];

  constructor(
    private giangVienService: giangVienService,
    private boMonService: boMonService,
    private shareService: shareService,
    private HomeMainComponent: HomeMainComponent,
    private truongKhoaService: truongKhoaService,
    private truongBmService: truongBmService,
  ) {}

  async ngOnInit() {
    this.getAllGiangVien();
    this.listBM = await this.boMonService.getAll();

  }

  async getAllGiangVien() {
    const maGv = this.HomeMainComponent.maGV;
    let truongKhoa, truongBm;
    try {
      truongKhoa = await this.truongKhoaService.getByMaGV(maGv);
    } catch { }
    try {
      truongBm = await this.truongBmService.getByMaGv(maGv);
    } catch { }

    if(truongKhoa?.maKhoa != null) {
      this.listGV = await this.giangVienService.getByMaKhoa(truongKhoa.maKhoa);
      this.root = this.listGV;
    }
    else if (truongBm?.maBm != null) {
      this.listGV = await this.giangVienService.getByBoMon(truongBm?.maBm);
      this.root = this.listGV;
    }
    else {
      this.listGV = [];
      this.root = [];
    }
  }

  async getGiangVienByMaBM(maBM: string) {
    this.listGV = await this.giangVienService.getByBoMon(maBM);
  }

  async sortGiangVien(sort: string) {
    if (sort == 'asc-id') {
      this.listGV.sort((a, b) => a.maGv.localeCompare(b.maGv));
    } else if (sort == 'desc-id') {
      this.listGV.sort((a, b) => b.maGv.localeCompare(a.maGv));
    } else if (sort == 'asc-name') {
      this.listGV.sort((a, b) => a.tenGv.localeCompare(b.tenGv));
    } else if (sort == 'desc-name') {
      this.listGV.sort((a, b) => b.tenGv.localeCompare(a.tenGv));
    } else if (sort == 'asc-subject') {
      this.listGV.sort((a, b) => a.maBm.localeCompare(b.maBm));
    } else if (sort == 'desc-subject') {
      this.listGV.sort((a, b) => b.maBm.localeCompare(a.maBm));
    } else {
      this.listGV = await this.giangVienService.getAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listGV = this.root.filter((item) =>
      item.tenGv.toLowerCase().includes(searchName)
    );
  }

  getTenBMById(maBM: string): string {
    let tenbbm: any = '';
    if (this.listBM) {
      tenbbm = this.listBM.find((t) => t.maBm === maBM)?.tenBm;
    }

    return tenbbm;
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}

