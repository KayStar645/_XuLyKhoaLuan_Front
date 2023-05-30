import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { format } from 'date-fns';
import * as saveAs from 'file-saver';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { baoCaoService } from 'src/app/services/baoCao.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { environment } from 'src/environments/environment.prod';

@Component({
   selector: 'app-dashboard-danhsachnopbai',
   templateUrl: './dashboard-danhsachnopbai.component.html',
   styleUrls: ['./dashboard-danhsachnopbai.component.scss'],
})
export class DashboardDanhsachnopbaiComponent implements OnInit {
   maCv = '';
   maDt = '';
   maNhom = '';
   baoCaos: any[] = [];
   sinhViens: SinhVien[] = [];
   types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar'];
   isClickAll: boolean = true;
   selectedSVs: any[] = [];

   constructor(private baoCaoService: baoCaoService, private sinhVienService: sinhVienService) {}

   async ngOnInit(): Promise<void> {
      this.maCv = window.history.state['maCv'];
      this.maDt = window.history.state['maDt'];
      this.maNhom = window.history.state['maNhom'];

      this.sinhViens = await this.sinhVienService.getSinhvienByDetai(this.maDt);
      this.baoCaos = await this.getAllBaoCao();
      this.selectedSVs = this.sinhViens.map((t) => t.maSv);
   }

   async getAllBaoCao(maSv: string = '') {
      let result: any[] = await this.baoCaoService.GetBaocaoByMacv(this.maCv, maSv);

      result.forEach(async (res: any) => {
         let hinh = `../../../../../assets/Images/file_type/doc.png`;
         let splits = res.fileBc.split('.');
         let type = splits[1];
         let src = '';

         if (this.types.includes(type)) {
            hinh = `../../../../../assets/Images/file_type/${type}.png`;
         }
         res['hinh'] = hinh;
         res['name'] = res.fileBc.split('__').pop();
         res['tgNop'] = format(new Date(res.tgNop), 'HH:mm dd-MM-yyyy');

         await axios.get(environment.githubHomeworkFilesAPI + res.fileBc).then((data) => {
            src = data.data.download_url;
            res['src'] = src;
         });
      });

      return result;
   }

   onSaveFile(url: string, name: string) {
      saveAs(url, name);
   }

   onChooseSinhVien(event: Event, maSv: string) {
      let element = event.target as HTMLInputElement;

      this.baoCaos = [];

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
      this.selectedSVs.forEach(async (maSV) => {
         let result = [...this.baoCaos, ...(await this.getAllBaoCao(maSV))];

         if (result.length > 0) {
            this.baoCaos = result;
         }
      });
   }

   onClickAll(event: Event) {
      let element = event.target as HTMLInputElement;

      this.baoCaos = [];
      this.isClickAll = element.checked;

      if (element.checked) {
         this.selectedSVs = this.sinhViens.map((t) => t.maSv);
      } else {
         this.selectedSVs = [];
      }

      this.selectedSVs.forEach(async (sv) => {
         this.baoCaos = [...this.baoCaos, ...(await this.getAllBaoCao(sv))];
      });
   }
}
