import { HomeMainComponent } from './../../home-main/home-main.component';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Form, Option, getParentElement } from 'src/assets/utils';
import { giangVienService } from 'src/app/services/giangVien.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { RaDe } from 'src/app/models/RaDe.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from 'src/app/services/deTai_chuyenNganh.service';
import { raDeService } from 'src/app/services/raDe.service';
import { duyetDtService } from 'src/app/services/duyetDt.service';
import { DuyetDt } from 'src/app/models/DuyetDt.model';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { HomeDanhsachdetaiComponent } from '../home-danhsachdetai/home-danhsachdetai.component';
import { shareService } from 'src/app/services/share.service';

@Component({
   selector: 'app-home-chitietdetai',
   templateUrl: './home-chitietdetai.component.html',
   styleUrls: ['./home-chitietdetai.component.scss'],
})
export class HomeChitietdetaiComponent {
   DSDTComponent!: HomeDanhsachdetaiComponent;
   _gvrd!: string;

   maDt: string = '';
   oldForm: any;
   deTai: DeTai = new DeTai();
   selectedCN: any[] = [];
   listSV: SinhVien[] = [];
   listDuyetDT: any[] = [];
   listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
   listRaDe: RaDe[] = [];
   slMin: number = 1;
   slMax: number = 3;
   tenGv: string = '';

   isTruongBM: boolean = false;
   isTruongK: boolean = false;
   isDTMe: boolean = false;
   isDTBM: boolean = false;
   isTrangThai: number = 0;

   GVInputConfig: any = {};
   CNInputConfig: any = {};

   dtForm = new Form({
      maDT: ['', Validators.required],
      tenDT: ['', Validators.required],
      tomTat: ['', Validators.required],
      slMin: ['', Validators.required],
      slMax: ['', Validators.required],
      trangThai: [false, Validators.required],
      tenGv: ['', Validators.required],
      maGv: ['', Validators.required],
      nhanXet: [''],
   });

   quillConfig: any = {
      toolbar: {
         container: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link'],
            ['clean'],
         ],
      },
   };

   constructor(
      private route: ActivatedRoute,
      private router: Router,
      private giangVienService: giangVienService,
      private chuyenNganhService: chuyenNganhService,
      private deTaiChuyenNganhService: deTai_chuyenNganhService,
      private duyetDTService: duyetDtService,
      private deTaiService: deTaiService,
      private raDeService: raDeService,
      private toastr: ToastrService,
      private websocketService: WebsocketService
   ) {}

   async ngOnInit() {
      this.listRaDe = await this.raDeService.getAll();

      this.listDeta_Chuyennganh = await this.deTaiChuyenNganhService.getAll();

      this.GVInputConfig.data = await this.giangVienService.getAll();
      this.GVInputConfig.keyword = 'tenGv';

      this.CNInputConfig.data = await this.chuyenNganhService.getAll();
      this.CNInputConfig.keyword = 'tenCn';

      this.route.params.subscribe((params) => {
         this.maDt = params['maDt'];
         this._gvrd = params['maGv'];
         this.setForm();
      });
      await this.isDeTaiOfBoMonMe(this._gvrd);

      await this.getComment();

      this.isDTMe = await this.deTaiService.CheckisDetaiOfGiangvien(this.maDt, HomeMainComponent.maGV);
      this.isTruongBM = HomeMainComponent.maBm == null ? false : true;
      this.isTruongK = HomeMainComponent.maKhoa == null ? false : true;

      this.websocketService.startConnection();
      this.isTrangthaiDetai(this.maDt);
      this.tenGv = (await this.giangVienService.getById(HomeMainComponent.maGV)).tenGv;
   }

   onSetDeTai(event: any) {}

   async getComment() {
      await this.duyetDTService.getByMadt(this.maDt).then((data) => {
         this.listDuyetDT = data.map((t: any) => {
            return {
               ...t,
               thoiGian: formatDistanceToNowStrict(new Date(t.ngayDuyet), {
                  locale: vi,
               }),
               tenGv: this.GVInputConfig.data.find((t2: any) => t2.maGv === t.maGv).tenGv,
            };
         });
      });
   }

   onBlur(event: any) {
      this.dtForm.inputBlur(event);
   }

   setSlMax(event: any) {
      let formValue: any = this.dtForm.form.value;
      const currentValue = parseInt(event.target.value);
      const previousValue = parseInt(event.target.defaultValue);

      if (currentValue > previousValue) {
         this.slMax += 1;
      } else if (currentValue < previousValue) {
         this.slMax -= 1;
      }

      if (currentValue < formValue.slMin) {
         this.dtForm.form.patchValue({
            slMin: currentValue - 1,
         });
      }
   }

   async onUpdate() {
      let formValue: any = this.dtForm.form.value;

      if (this.dtForm.form.valid) {
         const deTai = new DeTai();
         const raDe = new RaDe();
         const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];

         raDe.init(formValue.maGv, formValue.maDT);

         this.selectedCN.forEach((item) => {
            let deTaiChuyenNganh = new DeTai_ChuyenNganh();

            deTaiChuyenNganh.init(item.maCn, formValue.maDT);
            deTaiChuyenNganhs.push(deTaiChuyenNganh);
         });
         deTai.init(
            formValue.maDT,
            formValue.tenDT,
            formValue.tomTat,
            formValue.slMin,
            formValue.slMax,
            shareService.namHoc,
            shareService.dot
         );
         try {
            await this.deTaiService.update(deTai);

            deTaiChuyenNganhs.forEach(async (item) => {
               await this.deTaiChuyenNganhService.delete(item.maDt, item.maCn);
               await this.deTaiChuyenNganhService.add(item);
            });

            await this.raDeService.delete(raDe.maGv, raDe.maDt);
            await this.raDeService.add(raDe);

            this.toastr.success('Cập nhập thông tin đề tài thành công', 'Thông báo !');
         } catch {
            this.toastr.error('Cập nhập Đề tài thất bại', 'Thông báo !');
         }
      } else {
         this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Đề tài!');
         this.dtForm.validate('.dt-form');
      }
   }

   async setForm() {
      if (this.maDt) {
         await this.deTaiService.getById(this.maDt).then(async (data) => {
            let gv = this.getGvRadeByMaDT(data.maDT);

            this.deTai = data;
            this.getTenChuyennganhByMaDT(this.deTai.maDT);

            this.dtForm.form.patchValue({
               ...this.deTai,
               maGv: gv.maGv,
               tenGv: gv.tenGv,
               trangThai: JSON.stringify(this.deTai.trangThai),
            });

            this.oldForm = this.dtForm.form.value;
            this.oldForm.tenDT = this.oldForm.tenDT.replace('</p>', ` đợt ${data.dot} năm học ${data.namHoc}`) + '</p>';
         });
      } else {
         this.dtForm.resetForm('.dt-form');

         this.dtForm.form.patchValue({
            slMin: this.slMin,
            slMax: this.slMax,
         });
      }
   }

   onOpenDropdown(event: any) {
      event.stopPropagation();
      let parent = getParentElement(event.target, '.selected-box') || event.target;

      parent.classList.toggle('active');
   }

   async onAddComment() {
      const formValue: any = this.dtForm.form.value;
      const value: any = formValue.nhanXet;

      if (value) {
         try {
            let duyetDt = new DuyetDt();

            duyetDt.init(
               HomeMainComponent.maGV,
               this.maDt,
               format(new Date(), 'yyyy-MM-dd') + 'T' + format(new Date(), 'HH:mm:ss'),
               value
            );

            await this.duyetDTService.add(duyetDt);
            await this.getComment();
         } catch (error) {}
      }
   }

   createLanDuyet(maGv: string, maDt: string) {}

   onSetItem(event: any) {
      event.stopPropagation();
      let element = event.target;

      if (element.classList.contains('active')) {
         let index = this.selectedCN.findIndex((t) => t.maCn == element.dataset.index);

         element.classList.remove('active');
         this.selectedCN.splice(index, 1);
      } else {
         let index = element.dataset.index;
         element.classList.add('active');

         this.selectedCN.push({
            maCn: index,
            tenCn: element.innerText,
         });
      }
   }

   async onSearchCN(event: any) {
      let value = event.target.value;

      if (value) {
         this.CNInputConfig.data = this.CNInputConfig.data.filter((info: any) => {
            return info.tenCn.includes(value);
         });
      } else {
         await this.chuyenNganhService.getAll().then((data) => {
            this.CNInputConfig.data = data;
         });
      }
   }

   isCNExist(array: any[], item: any): boolean {
      return array.findIndex((i) => i.maCn === item.maCn) !== -1;
   }

   onClickInput(event: any) {
      event.stopPropagation();
   }

   async onAdd() {
      let formValue: any = this.dtForm.form.value;

      if (this.dtForm.form.valid) {
         const deTai = new DeTai();
         const raDe = new RaDe();
         const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];

         raDe.init(HomeMainComponent.maGV, formValue.maDT);

         this.selectedCN.forEach((item) => {
            let deTaiChuyenNganh = new DeTai_ChuyenNganh();

            deTaiChuyenNganh.init(item.maCn, formValue.maDT);
            deTaiChuyenNganhs.push(deTaiChuyenNganh);
         });
         deTai.init(
            '',
            formValue.tenDT,
            formValue.tomTat,
            formValue.slMin,
            formValue.slMax,
            shareService.namHoc,
            shareService.dot
         );

         try {
            await this.deTaiService.add(deTai);

            deTaiChuyenNganhs.forEach(async (item) => {
               await this.deTaiChuyenNganhService.add(item);
            });

            await this.raDeService.add(raDe);
            this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
            this.router.navigate(['/home/de-tai']);
            this.setForm();
         } catch (error) {
            this.toastr.success('Thêm đề tài thất bại', 'Thông báo !');
         }
      } else {
         this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
         this.dtForm.validate('.dt-form');
      }
   }

   setSelectedGV(event: any) {
      this.dtForm.form.patchValue({
         maGv: event.maGv,
      });
   }

   onDelete() {
      let formValue: any = this.dtForm.form.value;
      const _delete = document.querySelector('#delete')!;
      let option = new Option('#delete');

      _delete.classList.add('active');

      option.show('error', () => {});

      option.cancel(() => {});

      option.agree(async () => {
         try {
            const raDe = new RaDe();
            const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];
            // const duyetDT = new DuyetDt();

            raDe.init(formValue.maGv, formValue.maDT);

            this.selectedCN.forEach((item) => {
               let deTaiChuyenNganh = new DeTai_ChuyenNganh();

               deTaiChuyenNganh.init(item.maCn, formValue.maDT);
               deTaiChuyenNganhs.push(deTaiChuyenNganh);
            });

            deTaiChuyenNganhs.forEach(async (item) => {
               await this.deTaiChuyenNganhService.delete(item.maDt, item.maCn);
            });

            await this.duyetDTService.delete(HomeMainComponent.maGV, this.maDt, 1);
            await this.raDeService.delete(raDe.maGv, raDe.maDt);

            await this.deTaiService.delete(this.maDt);

            this.toastr.success('Xóa Đề tài thành công', 'Đề tài!');
            this.router.navigate(['/home/de-tai']);
         } catch (error) {
            this.toastr.error('Xóa Đề tài thất bại', 'Đề tài!');
         }
      });
   }

   async onBrowse(maDT: string, flag: boolean) {
      await this.duyetDTService.UpdateTrangthaiDetai(maDT, this.oldForm.maGv, flag);

      this.websocketService.sendForDeTai(true);
   }

   getTenChuyennganhByMaDT(maDT: string) {
      let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);

      for (let item of dtcns) {
         this.selectedCN.push({
            ...item,
            tenCn: this.CNInputConfig.data.find((t: any) => t.maCn == item.maCn)?.tenCn,
         });
      }
   }

   async isTrangthaiDetai(maDT: string) {
      const duyetdt = await this.duyetDTService.getByMadt(maDT);
      const detai = await this.deTaiService.getById(maDT);
      if (duyetdt.length == 0 && detai.trangThai == false) {
         this.isTrangThai = 0; // Chưa duyệt
      } else {
         this.isTrangThai = detai.trangThai == true ? 1 : -1;
      }

      // Websocket
      this.websocketService.receiveFromDeTai(async (dataChange: boolean) => {
         const duyetdt = await this.duyetDTService.getByMadt(maDT);
         const detai = await this.deTaiService.getById(maDT);
         if (duyetdt.length == 0 && detai.trangThai == false) {
            this.isTrangThai = 0; // Chưa duyệt
         } else {
            this.isTrangThai = detai.trangThai == true ? 1 : -1;
         }
      });
   }

   getThoiGianDuyetByMaDT(maDT: string) {
      let duyetdts = this.listDuyetDT.filter((item) => item.maDt == maDT);
      if (duyetdts.length > 0) {
         const date = duyetdts.reduce((max, duyetdt) => {
            return new Date(duyetdt?.ngayDuyet) > max ? new Date(duyetdt?.ngayDuyet) : max;
         }, new Date(duyetdts[0]?.ngayDuyet));
         return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      }
      return '';
   }

   getGvRadeByMaDT(maDT: string) {
      return this.GVInputConfig.data.find((t: any) => t.maGv === this.listRaDe.find((t) => t.maDt === maDT)?.maGv);
   }

   async isDeTaiOfBoMonMe(gvrd: string) {
      let gv = await this.giangVienService.getById(gvrd);
      if (gv.maBm == HomeMainComponent.maBm) {
         this.isDTBM = true;
      }
   }
}
