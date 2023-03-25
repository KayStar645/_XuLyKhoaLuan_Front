import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { Form, Option } from 'src/assets/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ministry-chitietnhiemvu',
  templateUrl: './ministry-chitietnhiemvu.component.html',
  styleUrls: ['./ministry-chitietnhiemvu.component.scss'],
})
export class MinistryChitietnhiemvuComponent {
  maNv: number = -1;
  oldForm: any;
  pdfSrc: any;
  nhiemVu: NhiemVu = new NhiemVu();
  listGV: GiangVien[] = [];
  GVInputConfig: any = {};
  nvForm = new Form({
    tenNv: ['', Validators.required],
    soLuongDt: [''],
    thoiDiemBd: [format(new Date(), 'yyyy-MM-dd'), Validators.required],
    ngayKt: ['', Validators.required],
    thoiGianKt: ['23:59:00'],
    fileNv: [''],
    maBm: ['', Validators.required],
    maGv: ['', Validators.required],
  });

  ngayKt: string = format(new Date(), 'dd-MM-yyyy');
  thoiGianKt: string = '00:00:00';

  constructor(
    private route: ActivatedRoute,
    private sharedService: shareService,
    private nhiemVuService: nhiemVuService,
    private giangVienService: giangVienService,
    private toastr: ToastrService,
    private _location: Location
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maNv = parseInt(params['maNv']);
      this.setForm();
    });

    await this.giangVienService.getAll().then((data) => {
      this.GVInputConfig.data = data;
      this.GVInputConfig.keyword = 'tenGv';
    });
  }

  async setForm() {
    if (this.maNv > 0) {
      await this.nhiemVuService
        .getById(this.maNv)
        .then((data) => {
          this.nhiemVu = data;
          this.ngayKt = format(new Date(this.nhiemVu.thoiGianKt), 'dd-MM-yyyy');
          this.thoiGianKt = format(
            new Date(this.nhiemVu.thoiGianKt),
            'HH:mm:ss'
          );

          return this.nhiemVu;
        })
        .then((response) => {
          axios
            .get(environment.githubMissionFilesAPI + response.fileNv)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });
        });

      this.nvForm.form.patchValue({
        ...this.nhiemVu,
        ngayKt: this.ngayKt,
        thoiGianKt: this.thoiGianKt,
        maGv: (await this.getGVienById(this.nhiemVu.maGv)).tenGv,
      });

      this.oldForm = this.nvForm.form.value;
    } else {
      this.maNv = -1;
      this.nvForm.resetForm('.tb-form');
      this.pdfSrc = 'https:/error.pdf';
    }
  }

  onChange(event: any) {
    let $img: any = event.target;

    this.nvForm.form.patchValue({
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
    if (this.nvForm.form.valid) {
      let nhiemVu = new NhiemVu();
      let file: any = document.querySelector('.attach-file');
      let formValue: any = this.nvForm.form.value;
      nhiemVu.init(
        0,
        formValue.tenNv,
        formValue.soLuongDt,
        formValue.thoiDiemBd,
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
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo!');
    }
  }

  async onUpdate() {
    this.nvForm.form.patchValue({
      maBm: format(new Date(), 'yyyy-MM-dd'),
    });

    if (this.nvForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) !== JSON.stringify(this.nvForm.form.value)
      ) {
        let nhiemVu = new NhiemVu();
        let file: any = document.querySelector('.attach-file');
        let formValue: any = this.nvForm.form.value;
        nhiemVu.init(
          this.maNv,
          formValue.tenNv,
          formValue.soLuongDt,
          formValue.thoiDiemBd,
          formValue.thoiGianKt,
          formValue.fileNv,
          formValue.maBm,
          formValue.maGv
        );
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

  async getGVienById(id: string) {
    return await this.giangVienService.getById(id).then((data) => {
      return data;
    });
  }
}
