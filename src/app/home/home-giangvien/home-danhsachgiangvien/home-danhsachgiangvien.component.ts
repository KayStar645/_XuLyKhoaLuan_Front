import { giangVienService } from 'src/app/services/giangVien.service';
import { HomeMainComponent } from './../../home-main/home-main.component';
import { shareService } from '../../../services/share.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { boMonService } from 'src/app/services/boMon.service';

@Component({
   selector: 'app-home-danhsachgiangvien',
   templateUrl: './home-danhsachgiangvien.component.html',
})
export class HomeDanhsachgiangvienComponent implements OnInit {
   @Input() searchName = '';

   listGV: GiangVien[] = [];
   temps: GiangVien[] = [];

   constructor(
      private giangVienService: giangVienService,
      private boMonService: boMonService,
      private shareService: shareService
   ) {}

   async ngOnInit() {
      this.getAllGiangVien();
   }

   async getAllGiangVien() {
      const maGv = HomeMainComponent.maGV;

      if (HomeMainComponent.maKhoa) {
         this.listGV = await this.giangVienService.search(
            '',
            this.searchName,
            shareService.namHoc,
            shareService.dot,
            true
         );
      } else if (HomeMainComponent.maBm) {
         this.listGV = await this.giangVienService.search(
            HomeMainComponent.maBm,
            this.searchName,
            shareService.namHoc,
            shareService.dot,
            true
         );
      } else {
         this.listGV = [];
      }

      for (let gv of this.listGV) {
         gv.cNhiemVu = await this.giangVienService.GetSoLuongNhiemVu(
            gv.maGv,
            shareService.namHoc,
            shareService.dot
         );
      }
      this.temps = this.listGV;
   }

   ngOnChanges(changes: SimpleChanges) {
      if (changes.searchName) {
         let value = this.searchName.trim().toLowerCase();
         this.temps = this.listGV.filter(
            (t) =>
               t.maGv.toLowerCase().includes(value) ||
               t.tenGv.toLowerCase().includes(value) ||
               t.email.toLowerCase().includes(value) ||
               t.sdt.toLowerCase().includes(value)
         );
      } else {
         this.temps = this.listGV;
      }
   }

   async getNameBomonById1(maBm: string) {
      var bomon = await this.boMonService.getById(maBm);
      return bomon.tenBm;
   }

   dateFormat(str: string): string {
      return this.shareService.dateFormat(str);
   }
}
