import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Form, Option } from 'src/assets/utils';
import { environment } from 'src/environments/environment.prod';
import { format } from 'date-fns';
import { shareService } from 'src/app/services/share.service';
import { Location } from '@angular/common';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
   selector: 'app-home-chitietthongbao',
   templateUrl: './home-chitietthongbao.component.html',
   styleUrls: ['./home-chitietthongbao.component.scss', '../home-thongbao.component.scss'],
})
export class HomeChitietthongbaoComponent implements OnInit {
   maTb: number = -1;
   listTB: any = [];
   oldForm: any;
   pdfSrc: any;
   thongBao: ThongBao = new ThongBao();
   tbForm = new Form({
      tenTb: ['', Validators.required],
      noiDung: [''],
      hinhAnh: ['man_with_tab.png', Validators.required],
      fileTb: [''],
      maKhoa: ['CNTT', Validators.required],
      ngayTb: [format(new Date(), 'yyyy-MM-dd')],
   });
   notifyNameConfig = {
      toolbar: [['bold', 'italic', 'underline'], [{ color: [] }], ['clean']],
   };

   notifyContentConfig = {
      toolbar: [
         [{ header: [1, 2, 3, 4, 5, 6, false] }],
         ['bold', 'italic', 'underline', 'strike'],
         ['blockquote'],
         [{ list: 'ordered' }, { list: 'bullet' }],
         [{ color: [] }],
         [{ align: [] }],
         ['link'],
         ['clean'],
      ],
   };

   constructor(
      private route: ActivatedRoute,
      private sharedService: shareService,
      private thongBaoService: thongBaoService,
      private toastr: ToastrService,
      private router: Router,
      private websocketService: WebsocketService,
      private shareService: shareService
   ) {}

   async ngOnInit() {
      this.listTB = await this.thongBaoService.getAll();

      this.route.params.subscribe(async (params) => {
         this.maTb = parseInt(params['maTb']);
         await this.setForm();
      });

      this.websocketService.startConnection();
   }

   async setForm() {
      if (this.maTb > 0) {
         await this.thongBaoService.getById(this.maTb).then((data) => {
            this.thongBao = data;

            this.tbForm.form.patchValue({
               ...this.thongBao,
            });

            this.pdfSrc = environment.downloadLink + this.thongBao.fileTb + '?folder=Notification';
            this.oldForm = this.tbForm.form.value;
         });
      } else {
         this.maTb = -1;
         this.tbForm.resetForm('.tb-form');
         this.pdfSrc = 'https:/error.pdf';
      }
   }

   onChange(event: any) {
      let $img: any = event.target;

      this.tbForm.form.patchValue({
         fileTb: event.target.files[0].name,
      });

      if (typeof FileReader !== 'undefined') {
         let reader = new FileReader();

         reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;
         };

         reader.readAsArrayBuffer($img.files[0]);
      }
   }

   dateFormat(str: string) {
      return this.shareService.dateFormat(str);
   }
}
