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
    thoiDiemBd: [''],
    ngayKt: ['', Validators.required],
    thoiGianKt: ['', Validators.required],
    fileNv: ['error.pdf'],
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
      this.ngayBd = format(new Date(), 'dd-MM-yyyy');
      this.maNv = -1;
      this.nvForm.resetForm('.tb-form');
      this.pdfSrc = 'https:/error.pdf';

      this.nvForm.form.patchValue({
        thoiGianKt: '23:59:00',
        soLuongDt: 1,
      });
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
        format(new Date(), 'yyyy-MM-dd'),
        dateVNConvert(formValue.ngayKt) + 'T' + formValue.thoiGianKt + '.000Z',
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
        await this.nhiemVuService.add(nhiemVu);
        this.toastr.success('Thêm nhiệm vụ thành công', 'nhiệm vụ !');
        this._location.go('/minitry/thong-bao/chi-tiet', 'maTb=-1');
        this.setForm();
      } catch (error) {
        this.toastr.error('Thêm nhiệm vụ thất bại', 'nhiệm vụ !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'nhiệm vụ!');
      this.nvForm.validate('.tb-form');
    }
  }

  setSelectedNV(event: any) {
    this.nvForm.form.patchValue({
      maGv: event.maGv,
      maBm: event.maBm,
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

          this.toastr.success('Cập nhập nhiệm vụ thành công', 'nhiệm vụ !');
        } catch (error) {
          this.toastr.error('Cập nhập nhiệm vụ thất bại', 'nhiệm vụ !');
        }
      } else {
        this.toastr.info(
          'Thông tin của bạn không thay đổi kể từ lần cuối',
          'nhiệm vụ !'
        );
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'nhiệm vụ!');
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
        this.setForm();
        this.toastr.success('Xóa nhiệm vụ thành công', 'nhiệm vụ!');
        window.location.href = '/minitry/nhiem-vu/';
      } catch (error) {
        this.toastr.error('Xóa nhiệm vụ thất bại', 'nhiệm vụ!');
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

    ngayKt.setValidators([
      this.sharedService.customValidator(
        'smallerDay',
        / /,
        formValue.ngayKt > this.ngayBd ? true : false
      ),
      Validators.required,
    ]);
    ngayKt.updateValueAndValidity();
    this.nvForm.validateSpecificControl(['ngayKt', 'thoiGianKt']);
  }

  onDateTimeChange() {
    this.checkDaySmaller();
  }

  onDateChange(event: any) {
    this.onDateTimeChange();
  }

  onTimeChange(event: any) {
    this.onDateTimeChange();
  }
}
