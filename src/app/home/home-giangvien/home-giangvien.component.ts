import { HomeDanhsachgiangvienComponent } from './home-danhsachgiangvien/home-danhsachgiangvien.component';
import { BoMon } from '../../models/BoMon.model';
import { boMonService } from '../../services/boMon.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-giangvien',
  templateUrl: './home-giangvien.component.html',
  // styleUrls: ['./home-giangvien.component.scss']
})
export class HomeGiangvienComponent implements OnInit {
  @ViewChild(HomeDanhsachgiangvienComponent)
  private DSGVComponent!: HomeDanhsachgiangvienComponent;
  listBoMon: BoMon[] = [];
  searchName = '';
  selectedBomon!: string;
  giangVienFile: any;

  isSelectedGV: boolean = false;

  constructor(
    private titleService: Title,
    private boMonService: boMonService,
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách giảng viên');
    this.listBoMon = await this.boMonService.getAll();
    if (this.listBoMon.length > 0) {
      this.selectedBomon = this.listBoMon[0].maBm;
    }
  }

  setIsSelectedGv(event: any) {
    this.isSelectedGV = event;
  }
  getGiangVienByMaBM(event: any) {
    const maBM = event.target.value;
    if (maBM == '') {
      this.DSGVComponent.getAllGiangVien();
    } else {
      this.DSGVComponent.getGiangVienByMaBM(maBM);
    }
  }

  sortGiangVien(event: any) {
    const sort = event.target.value;
    this.DSGVComponent.sortGiangVien(sort);
  }
}
