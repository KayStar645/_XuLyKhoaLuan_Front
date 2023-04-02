import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Form, Option } from 'src/assets/utils';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home-chitietnhiemvu',
  templateUrl: './home-chitietnhiemvu.component.html',
  styleUrls: ['./home-chitietnhiemvu.component.scss'],
})
export class HomeChitietnhiemvuComponent {
  maNv: number = -1;
  oldForm: any;
  pdfSrc: any;
  nhiemVu: NhiemVu = new NhiemVu();
  tbForm = new Form({
    tenNv: ['', Validators.required],
    soLuongDt: [''],
    thoiGianBd: ['', Validators.required],
    thoiGianKt: [''],
    fileNv: [''],
    maBm: ['', Validators.required],
    maGv: ['', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private sharedService: shareService,
    private nhiemVuService: nhiemVuService,
    private toastr: ToastrService,
    private _location: Location,
    private websocketService: WebsocketService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maNv = parseInt(params['maNv']);
      this.setForm();
    });
  }

  async setForm() {
    if (this.maNv > 0) {
      await this.nhiemVuService
        .getById(this.maNv)
        .then((data) => {
          this.nhiemVu = data;
          return data;
        })
        .then((response) => {
          axios
            .get(environment.githubNotifyFilesAPI + response.fileNv)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });
        });

      this.tbForm.form.patchValue({
        ...this.nhiemVu,
      });

      this.oldForm = this.tbForm.form.value;
    } else {
      this.maNv = -1;
      this.tbForm.resetForm('.tb-form');
      this.pdfSrc = 'https:/error.pdf';
    }
  }

  onChange(event: any) {
    let $img: any = event.target;

    this.tbForm.form.patchValue({
      thoiGianKt: event.target.files[0].name,
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
      let nhiemVu = new NhiemVu();
      let file: any = document.querySelector('.attach-file');
      let formValue: any = this.tbForm.form.value;
      nhiemVu.init(
        0,
        formValue.tenNv,
        formValue.soLuongDt,
        formValue.thoiGianBd,
        formValue.thoiGianKt,
        formValue.fileNv,
        formValue.maBm,
        formValue.maGv
      );
      try {
        await this.nhiemVuService.add(nhiemVu);
        this.sharedService.uploadFile(file);
        this.toastr.success('Thêm thông báo thành công', 'Thông báo !');
        this.setForm();
      } catch (error) {
        this.toastr.error('Thêm thông báo thất bại', 'Thông báo !');
        console.log(error);
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo!');
    }
  }

  async onUpdate() {
    this.tbForm.form.patchValue({
      maBm: format(new Date(), 'yyyy-MM-dd'),
    });

    if (this.tbForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) !== JSON.stringify(this.tbForm.form.value)
      ) {
        let nhiemVu = new NhiemVu();
        let file: any = document.querySelector('.attach-file');
        let formValue: any = this.tbForm.form.value;
        nhiemVu.init(
          this.maNv,
          formValue.tenNv,
          formValue.soLuongDt,
          formValue.thoiGianBd,
          formValue.thoiGianKt,
          formValue.fileNv,
          formValue.maBm,
          formValue.maGv
        );
        console.log(formValue.thoiGianKt);
        try {
          await this.nhiemVuService.update(nhiemVu);
          if (file.files[0]) {
            this.sharedService.uploadFile(file);
          }
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
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo!');
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
        await this.nhiemVuService.delete(this.maNv);
        this._location.go('/minitry/thong-bao/chi-tiet', 'maNv=-1');
        this.setForm();
        this.toastr.success('Xóa thông báo thành công', 'Thông báo!');
      } catch (error) {
        this.toastr.error('Xóa thông báo thất bại', 'Thông báo!');
      }
      _delete.classList.remove('active');
    });
  }
}
