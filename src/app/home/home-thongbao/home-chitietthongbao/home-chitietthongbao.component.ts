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
  styleUrls: [
    './home-chitietthongbao.component.scss',
    '../home-thongbao.component.scss',
  ],
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
      await this.thongBaoService
        .getById(this.maTb)
        .then((data) => {
          this.thongBao = data;
          return data;
        })
        .then((response) => {
          axios
            .get(environment.githubNotifyFilesAPI + response.fileTb)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });

          this.tbForm.form.patchValue({
            ...this.thongBao,
          });

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

  async onAdd() {
    if (this.tbForm.form.valid) {
      let thongBao = new ThongBao();
      let file: any = document.querySelector('.attach-file');
      let formValue: any = this.tbForm.form.value;
      thongBao.init(
        0,
        formValue.tenTb,
        formValue.noiDung,
        formValue.hinhAnh,
        formValue.fileTb,
        formValue.maKhoa,
        formValue.ngayTb
      );
      try {
        if (file && file.files[0]) {
          await this.sharedService.uploadFile(file.files[0]);
        }
        await this.thongBaoService.add(thongBao);
        await this.setForm();
        this.websocketService.sendForThongBao(true);

        this.router.navigate(['/home/thong-bao/chi-tiet', { maTb: -1 }]);
        this.toastr.success('Thêm thông báo thành công', 'Thông báo !');
      } catch (error) {
        this.toastr.error('Thêm thông báo thất bại', 'Thông báo !');
        console.log(error);
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
    }
  }

  async onUpdate() {
    this.tbForm.form.patchValue({
      ngayTb: format(new Date(), 'yyyy-MM-dd'),
    });

    if (this.tbForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) !== JSON.stringify(this.tbForm.form.value)
      ) {
        let thongBao = new ThongBao();
        let file: any = document.querySelector('.attach-file');
        let formValue: any = this.tbForm.form.value;
        thongBao.init(
          this.maTb,
          formValue.tenTb,
          formValue.noiDung,
          formValue.hinhAnh,
          formValue.fileTb,
          formValue.maKhoa,
          formValue.ngayTb
        );
        try {
          if (file && file.files[0]) {
            await this.sharedService.uploadFile(file.files[0]);
          }
          await this.thongBaoService.update(thongBao);
          this.websocketService.sendForThongBao(true);

          this.toastr.success('Cập nhập thông báo thành công', 'Thông báo !');
        } catch (error) {
          this.toastr.error('Cập nhập thông báo thất bại', 'Thông báo !');
        }
      } else {
        this.toastr.info(
          'Thông tin của bạn không thay đổi kể từ lần cuối',
          'Thông báo !'
        );
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
    }
  }

  onDelete() {
    const _delete = document.querySelector('#delete')!;

    _delete.classList.add('active');
    let option = new Option('#delete');

    option.show('error', () => {
      _delete.classList.remove('active');
    });

    option.cancel(() => {
      _delete.classList.remove('active');
    });

    option.agree(async () => {
      try {
        await this.thongBaoService.delete(this.maTb);
        this.setForm();
        this.toastr.success('Xóa thông báo thành công', 'Thông báo !');
        this.router.navigate(['/home/thong-bao/']);
      } catch (error) {
        this.toastr.error('Xóa thông báo thất bại', 'Thông báo !');
      }
      _delete.classList.remove('active');
    });
  }

  randomNumber(length: number): number {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return parseInt(result);
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
