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

  root: GiangVien[] = [];
  listGV: GiangVien[] = [];
  listBM: BoMon[] = [];

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
    const maGv = HomeMainComponent.maGV;
    let truongKhoa, truongBm;
    try {
      truongKhoa = await this.truongKhoaService.CheckTruongKhoaByMaGV(maGv);
    } catch { }
    try {
      truongBm = await this.truongBmService.CheckTruongBomonByMaGV(maGv);
    } catch { }

    if(truongKhoa != null) {
      this.listGV = await this.giangVienService.getByMaKhoa(truongKhoa.maKhoa);
      this.root = this.listGV;
    }
    else if (truongBm != null) {
      this.listGV = await this.giangVienService.getByBoMon(truongBm.maBm);
      this.root = this.listGV;
    }
    else {
      this.listGV = [];
      this.root = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  async getNameBomonById1(maBm: string) {
    var bomon = await this.boMonService.getById(maBm);
    return bomon.tenBm;
  }

  getNameBomonById(maBm: string): string {
    let tenbm: any = '';

    if (this.listBM) {
      tenbm = this.listBM.find((t) => t.maBm === maBm)?.tenBm;
    }
    return tenbm;
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listGV = this.root.filter((item) =>
      item.tenGv.toLowerCase().includes(searchName)
    );
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}

