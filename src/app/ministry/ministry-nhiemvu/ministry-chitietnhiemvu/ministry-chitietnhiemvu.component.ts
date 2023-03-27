import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { dateVNConvert, Form, Option } from 'src/assets/utils';
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
    soLuongDt: ['', [Validators.required, Validators.min(1)]],
    thoiDiemBd: [format(new Date(), 'yyyy-MM-dd')],
    ngayKt: [''],
    thoiGianKt: ['23:59:00'],
    fileNv: [''],
    maBm: ['', Validators.required],
    maGv: ['', Validators.required],
    hoTen: ['', Validators.required],
  });

  ngayBd: string = '';
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
        .then(async (data) => {
          this.nhiemVu = data;
          this.ngayBd = format(new Date(this.nhiemVu.thoiGianBd), 'dd-MM-yyyy');
          this.ngayKt = format(new Date(this.nhiemVu.thoiGianKt), 'dd-MM-yyyy');
          this.thoiGianKt = format(
            new Date(this.nhiemVu.thoiGianKt),
            'HH:mm:ss'
          );

          this.nvForm.form.patchValue({
            ...this.nhiemVu,
            ngayKt: this.ngayKt,
            thoiGianKt: this.thoiGianKt,
            hoTen: (await this.getGVienById(this.nhiemVu.maGv)).tenGv,
          });

          return this.nhiemVu;
        })
        .then((response) => {
          axios
            .get(environment.githubMissionFilesAPI + response.fileNv)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });
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
      fileNv: event.target.files[0].name,
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
        formValue.thoiDiemKt,
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

  setSelectedNV(event: any) {
    this.nvForm.form.patchValue({
      maGv: event.maGv,
    });
  }

  async onUpdate() {
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
          dateVNConvert(formValue.ngayKt) +
            'T' +
            formValue.thoiGianKt +
            '.000Z',
          formValue.fileNv,
          formValue.maBm,
          formValue.maGv
        );

        try {
          if (file && file.files[0]) {
            await this.sharedService.uploadFile(
              file.files[0],
              environment.githubMissionFilesAPI
            );
          }
          await this.nhiemVuService.update(nhiemVu);

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
      this.nvForm.validate('.tb-form');
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

  checkDaySmaller() {
    let formValue: any = this.nvForm.form.value;
    let ngayKt: any = this.nvForm.form.get('ngayKt');

    ngayKt.setValidators(
      this.sharedService.customValidator(
        'smallerDay',
        / /,
        formValue.ngayKt > this.ngayBd ? true : false
      )
    );
    ngayKt.updateValueAndValidity();
  }

  onDateTimeChange() {
    this.checkDaySmaller();
    this.nvForm.validateSpecificControl(['ngayKt', 'thoiGianKt']);
  }

  onDateChange(event: any) {
    this.onDateTimeChange();
  }

  onTimeChange(event: any) {
    this.onDateTimeChange();
  }
}
