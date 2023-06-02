import { sinhVienService } from './../../../../services/sinhVien.service';
import { baoCaoService } from './../../../../services/baoCao.service';
import { Component, OnInit } from '@angular/core';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { format } from 'date-fns';
import { FileService } from 'src/app/services/file.service.ts.service';
import { environment } from 'src/environments/environment.prod';

@Component({
   selector: 'app-home-danhsachnopbai',
   templateUrl: './home-danhsachnopbai.component.html',
   styleUrls: ['./home-danhsachnopbai.component.scss'],
})
export class HomeDanhsachnopbaiComponent implements OnInit {
   maCv = '';
   maDt = '';
   maNhom = '';
   baoCaos: any[] = [];
   sinhViens: SinhVien[] = [];
   types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar'];
   isClickAll: boolean = true;
   selectedSVs: any[] = [];

   constructor(
      private baoCaoService: baoCaoService,
      private sinhVienService: sinhVienService,
      private fileService: FileService
   ) {}

   async ngOnInit(): Promise<void> {
      this.maCv = window.history.state['maCv'];
      this.maDt = window.history.state['maDt'];
      this.maNhom = window.history.state['maNhom'];

      this.sinhViens = await this.sinhVienService.getSinhvienByDetai(this.maDt);
      this.selectedSVs = this.sinhViens.map((t) => t.maSv);

      this.baoCaos = [];

      this.selectedSVs.forEach(async (sv) => {
         let result = await this.getAllBaoCao(sv);
         this.baoCaos = [...this.baoCaos, ...result];
      });
   }

   async getAllBaoCao(maSv: string = '') {
      let result: any[] = await this.baoCaoService.GetBaocaoByMacv(this.maCv, maSv);

      result.forEach(async (res: any) => {
         let hinh = `../../../../../assets/Images/file_type/doc.png`;
         let splits = res.fileBc.split('.');
         let type = splits[1];

         if (this.types.includes(type)) {
            hinh = `../../../../../assets/Images/file_type/${type}.png`;
         }
         res['hinh'] = hinh;
         res['name'] = res.fileBc.split('__').pop();
         res['fileBc'] = res.fileBc;
         res['tgNop'] = format(new Date(res.tgNop), 'HH:mm dd-MM-yyyy');
         res['src'] = environment.downloadLink + res.fileBc + '?folder=Homework';
      });

      return result;
   }

   onChooseSinhVien(event: Event, maSv: string) {
      let element = event.target as HTMLInputElement;

      if (element.checked) {
         this.selectedSVs.push(maSv);
         if (this.selectedSVs.length === this.sinhViens.length) {
            this.isClickAll = true;
         }
      } else {
         this.selectedSVs.splice(this.selectedSVs.indexOf(maSv), 1);
         this.baoCaos.splice(
            this.baoCaos.findIndex((t) => t.maSv === maSv),
            1
         );
         if (this.selectedSVs.length === 0) {
            this.isClickAll = false;
         }
      }
      this.baoCaos = [];

      this.selectedSVs.forEach(async (sv) => {
         let result = await this.getAllBaoCao(sv);
         this.baoCaos = [...this.baoCaos, ...result];
      });
   }

   onClickAll(event: Event) {
      let element = event.target as HTMLInputElement;

      this.isClickAll = element.checked;

      if (element.checked) {
         this.selectedSVs = this.sinhViens.map((t) => t.maSv);
      } else {
         this.selectedSVs = [];
      }
      this.baoCaos = [];

      this.selectedSVs.forEach(async (sv) => {
         let result = await this.getAllBaoCao(sv);
         this.baoCaos = [...this.baoCaos, ...result];
      });
   }
}
