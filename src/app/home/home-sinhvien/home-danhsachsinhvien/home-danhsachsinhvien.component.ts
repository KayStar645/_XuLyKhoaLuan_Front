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

@Component({
   selector: 'app-home-danhsachsinhvien',
   templateUrl: './home-danhsachsinhvien.component.html',
})
export class HomeDanhsachsinhvienComponent implements OnInit {
   @Input() searchName = '';
   @Input() isSelectedTG = false;
   _searchName = '';
   _maCn = '';

   @Output() returnIsSelectedTG = new EventEmitter<boolean>();
   listTg: ThamGia[] = [];
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

   async getAllThamgiaByDotdk() {
      this.listTg = await this.thamGiaService.search(
         this._searchName,
         this._maCn,
         shareService.namHoc,
         shareService.dot
      );
   }

   async getThamgiaByMaCN(maCn: string) {
      this._maCn = maCn;
      this.listTg = await this.thamGiaService.search(
         this._searchName,
         this._maCn,
         shareService.namHoc,
         shareService.dot
      );
   }

   async ngOnChanges(changes: SimpleChanges) {
      if (changes.searchName) {
         const name = this.searchName.trim().toLowerCase();
         this._searchName = name;
         this.listTg = await this.thamGiaService.search(
            this._searchName,
            this._maCn,
            shareService.namHoc,
            shareService.dot
         );
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