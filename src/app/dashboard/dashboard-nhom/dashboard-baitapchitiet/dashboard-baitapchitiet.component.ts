import { sinhVienService } from './../../../services/sinhVien.service';
import { Component } from '@angular/core';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { add, compareAsc, format, formatDistanceToNowStrict } from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form } from 'src/assets/utils';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DashboardComponent } from '../../dashboard.component';
import { ToastrService } from 'ngx-toastr';
import { baoCaoService } from 'src/app/services/baoCao.service';
import { BaoCao } from 'src/app/models/BaoCao.model';
import { Validators } from '@angular/forms';
import { vi } from 'date-fns/locale';
import { Traodoi } from 'src/app/models/VirtualModel/TraodoiModel';
import { traoDoiService } from 'src/app/services/NghiepVu/traodoi.service';
import { BaoCaoVT } from 'src/app/models/VirtualModel/BaoCaoVTModel';
import { FileService } from 'src/app/services/file.service.ts.service';
@Component({
   selector: 'app-dashboard-baitapchitiet',
   templateUrl: './dashboard-baitapchitiet.component.html',
   styleUrls: ['./dashboard-baitapchitiet.component.scss'],
})
export class DashboardBaitapchitietComponent {
   maCV = '';
   namHoc = '';
   dot = -1;
   cviec: CongViec = new CongViec();
   giangVien: GiangVien = new GiangVien();
   thoiHan = '';
   listTraoDoi: Traodoi[] = [];
   isOutDate: number = -2; // Chưa nộp
   homeworkFiles: any[] = [];
   apiHomeworkFiles: any[] = [];
   apiBaoCaos: BaoCaoVT[] = [];

   dtForm = new Form({
      nhanXet: ['', Validators.required],
   });

   types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar', 'zip'];

   constructor(
      private congViecService: congViecService,
      private giangVienService: giangVienService,
      private traoDoiService: traoDoiService,
      private toastService: ToastrService,
      private websocketService: WebsocketService,
      private binhLuanService: binhLuanService,
      private baoCaoService: baoCaoService,
      private sinhVienService: sinhVienService,
      private fileService: FileService
   ) {}
   async ngOnInit() {
      this.getNamhocDot();
      this.maCV = window.history.state.maCv;
      this.cviec = await this.congViecService.getById(this.maCV);
      this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
      this.catchDateTime();
      this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(this.maCV);

      this.websocketService.startConnection();
      this.websocketService.receiveFromBinhLuan(async (dataChange: boolean) => {
         if (dataChange) {
            await this.getBinhLuans();
         }
      });

      this.websocketService.receiveFromBaoCao(async (dataChange: boolean) => {
         if (dataChange) {
            await this.getAllHomeworkFiles();
         }
      });
      await this.getAllHomeworkFiles();

      await this.getBinhLuans();

      if (
         compareAsc(new Date(this.cviec.hanChot), new Date()) === -1 &&
         this.apiHomeworkFiles.length === 0
      ) {
         this.isOutDate = -1;
      } else {
         for (let b of this.apiBaoCaos) {
            if (compareAsc(new Date(this.cviec.hanChot), new Date(b.tgNop)) === -1) {
               this.isOutDate = 0;
               return;
            }
            this.isOutDate = 1;
         }
      }
   }

   onSelect(event: any) {
      event.addedFiles.forEach((file: any) => {
         let fileSplit: string[] = file.name.split('.');
         let type = fileSplit[fileSplit.length - 1];
         let item: any = {};

         if (this.types.includes(type)) {
            item['img'] = `../../../../assets/Images/file_type/${type}.png`;
         } else {
            item['img'] = `../../../../assets/Images/file_type/doc.png`;
         }
         item['name'] = file.name;
         item['type'] = type;
         item['file'] = file;
         this.homeworkFiles.push(item);
      });
   }

   onRemove(event: any) {
      let index = this.homeworkFiles.findIndex((t) => t.file === event);

      this.homeworkFiles.splice(index, 1);
   }

   async getBinhLuans() {
      this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(this.maCV);
   }

   catchDateTime() {
      this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace('-', ' tháng ');
   }

   async onAddComment() {
      if (this.dtForm.form.valid) {
         let formValue: any = this.dtForm.form.value;
         let binhLuan = new BinhLuan();
         binhLuan.dot = this.dot;
         binhLuan.id = 0;
         binhLuan.maCv = this.maCV;
         binhLuan.maSv = DashboardComponent.maSV;
         binhLuan.namHoc = this.namHoc;
         binhLuan.noiDung = formValue.nhanXet;
         binhLuan.thoiGian =
            format(new Date(), 'yyyy-MM-dd') + 'T' + format(new Date(), 'HH:mm:ss') + '.000Z';
         try {
            await this.binhLuanService.add(binhLuan);
            this.websocketService.sendForBinhLuan(true);
            this.dtForm.form.patchValue({
               nhanXet: '',
            });
         } catch (error) {
            this.toastService.error('Nhận xét thất bại', 'Thông báo');
         }
      } else {
         this.toastService.warning('Nội dung không được để trống', 'Thông báo !');
      }
   }

   async getAllHomeworkFiles() {
      this.apiHomeworkFiles = [];
      this.homeworkFiles = [];
      this.apiBaoCaos = await this.baoCaoService.GetBaocaoByMacv(this.maCV, '');

      this.apiBaoCaos.forEach((file: BaoCaoVT) => {
         let fileSplit: string[] = file.fileBc.split('.');
         let type = fileSplit[1];
         let item: any = {};

         if (this.types.includes(type)) {
            item['img'] = `../../../../assets/Images/file_type/${type}.png`;
         } else {
            item['img'] = `../../../../assets/Images/file_type/doc.png`;
         }
         item['name'] = file.fileBc.split('__').pop();
         item['type'] = type;
         this.apiHomeworkFiles.push(item);
      });
   }

   async onAddFile() {
      let input: any = document.querySelector('.home-work input');
      input.click();
   }

   format(value: string) {
      let date = new Date(value);
      let dateAdd = add(date, { days: 1 });
      let newValue = format(date, 'dd-MM-yyyy HH:mm');

      if (compareAsc(dateAdd, new Date()) === 1) {
         return (
            formatDistanceToNowStrict(date, {
               locale: vi,
            }) + ' trước'
         );
      }

      return newValue;
   }

   onRemveFileItem(event: any, name: String) {}

   async onSubmitHomeWork() {
      if (this.homeworkFiles.length > 0) {
         try {
            for (let homework of this.homeworkFiles) {
               let res = await this.fileService.uploadFile(homework.file, 'Homework');

               await this.addBaoCao(res.fileName);

               this.toastService.success('Nộp báo cáo thành công', 'Thông báo !');
               this.websocketService.sendForBaoCao(true);
            }
         } catch (error) {
            this.toastService.error('Nộp báo cáo thất bại', 'Thông báo!');
         }
      } else {
         this.toastService.warning('Vui lòng thêm file đi kèm', 'Thông báo !');
      }
   }

   async addBaoCao(fileName: string) {
      let currDate = new Date();
      let thoiGianNop =
         format(currDate, 'yyyy-MM-dd') + 'T' + format(currDate, 'HH:mm:ss') + '.000Z';
      let baoCao = new BaoCao();
      baoCao.init(this.maCV, DashboardComponent.maSV, this.namHoc, this.dot, thoiGianNop, fileName);
      await this.baoCaoService.add(baoCao);
   }

   async getNameSinhvien(maSv: string) {
      let sv = await this.sinhVienService.getById(maSv);
      return sv.maSv + ' - ' + sv.tenSv;
   }

   getNamhocDot() {
      let maNhom = DashboardComponent.maNhom;
      this.namHoc = maNhom.substring(10, 19);
      this.dot = parseInt(maNhom.substring(maNhom.length - 1));
   }
}
