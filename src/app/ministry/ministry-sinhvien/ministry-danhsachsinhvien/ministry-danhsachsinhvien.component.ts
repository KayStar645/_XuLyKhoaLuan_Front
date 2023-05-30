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
import { WebsocketService } from 'src/app/services/Websocket.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement } from 'src/assets/utils';

@Component({
   selector: 'app-ministry-danhsachsinhvien',
   templateUrl: './ministry-danhsachsinhvien.component.html',
})
export class MinistryDanhsachsinhvienComponent implements OnInit {
   @Input() searchName = '';
   @Input() isSelectedSV = false;
   @Output() returnIsSelectedSV = new EventEmitter<boolean>();
   _searchName = '';
   _maCn = '';
   _lop = '';

   root: SinhVien[] = [];
   sinhVien = new SinhVien();

   listSV: SinhVien[] = [];
   listCN: ChuyenNganh[] = [];
   selectedSV: string[] = [];
   lineSV = new SinhVien();
   elementOld: any;
   temps: SinhVien[] = [];

   constructor(
      private sinhVienService: sinhVienService,
      private elementRef: ElementRef,
      private chuyenNganhService: chuyenNganhService,
      private shareService: shareService,
      private websocketService: WebsocketService
   ) {}

   async ngOnInit() {
      await this.getAllSinhVien();
      this.listCN = await this.chuyenNganhService.getAll();

      window.addEventListener('keydown', (e) => {
         if (e.key === 'Escape') {
            this.selectedSV = [];
            this.returnIsSelectedSV.emit(false);
            let activeLine = this.elementRef.nativeElement.querySelectorAll(
               '.br-line.br-line-click'
            );
            if (activeLine) {
               activeLine.forEach((line: any) => {
                  line.classList.remove('br-line-click');
               });
            }
         }
      });

      this.websocketService.startConnection();
      this.websocketService.receiveFromSinhVien((dataChange: boolean) => {
         if (dataChange) {
            this.getAllSinhVien();
         }
      });
   }

   async clickLine(event: any) {
      const parent = getParentElement(event.target, '.br-line');
      const firstChild = parent.firstChild;

      if (!parent.classList.contains('br-line-dblclick')) {
         this.lineSV = await this.sinhVienService.getById(firstChild.innerText);
         parent.classList.add('br-line-dblclick');
      } else {
         this.lineSV = new SinhVien();
         parent.classList.remove('br-line-dblclick');
      }
   }

   async getAllSinhVien() {
      this.listSV = await this.sinhVienService.search(
         this._maCn,
         this._lop,
         this._searchName
      );

      this.temps = this.listSV;
   }

   async getSinhVienByClass(lop: string) {
      this._lop = lop;
      this.listSV = await this.sinhVienService.search(
         this._maCn,
         this._lop,
         this._searchName
      );
      this.temps = this.listSV;
   }

   getSelectedLine(e: any) {
      if (e.ctrlKey) {
         this.returnIsSelectedSV.emit(true);
         const activeDblClick = this.elementRef.nativeElement.querySelector(
            '.br-line.br-line-dblclick'
         );
         const parent = getParentElement(e.target, '.br-line');
         const firstChild = parent.firstChild;

         if (activeDblClick) {
            activeDblClick.classList.remove('.br-line-dblclick');
            this.lineSV = new SinhVien();
         }

         if (parent.classList.contains('br-line-click')) {
            let childIndex = this.selectedSV.findIndex(
               (t) => t === firstChild.innerText
            );

            parent.classList.remove('br-line-click');
            this.selectedSV.splice(childIndex, 1);
         } else {
            parent.classList.add('br-line-click');
            this.selectedSV.push(firstChild.innerText);
         }

         if (this.selectedSV.length === 0) {
            this.returnIsSelectedSV.emit(false);
         }
      }
   }

   async getSinhVienByMaCN(maCn: string) {
      this._maCn = maCn;
      this.listSV = await this.sinhVienService.search(
         this._maCn,
         this._lop,
         this._searchName
      );
      this.temps = this.listSV;
   }

   async ngOnChanges(changes: SimpleChanges) {
      if (changes.searchName) {
         const searchName = changes.searchName.currentValue;
         this._searchName = searchName;

         if (searchName) {
            this.temps = this.listSV.filter(
               (t) =>
                  t.lop.toLowerCase().includes(searchName.toLowerCase()) ||
                  t.maSv.toLowerCase().includes(searchName.toLowerCase()) ||
                  t.sdt.toLowerCase().includes(searchName.toLowerCase()) ||
                  t.email.toLowerCase().includes(searchName.toLowerCase()) ||
                  t.tenSv.toLowerCase().includes(searchName.toLowerCase())
            );
         } else {
            this.temps = this.listSV;
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

   dateFormat(str: string) {
      return this.shareService.dateFormat(str);
   }
}
