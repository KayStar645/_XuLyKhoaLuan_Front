import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { giangVienService } from 'src/app/services/giangVien.service';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { dateVNConvert, Form, Option } from 'src/assets/utils';
import { environment } from 'src/environments/environment.prod';
import { HomeMainComponent } from '../../home-main/home-main.component';

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
  isTruongBM: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: shareService,
    private nhiemVuService: nhiemVuService,
    private giangVienService: giangVienService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maNv = parseInt(params['maNv']);
      await this.setForm();
    });
    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;

    this.GVInputConfig.data = await this.giangVienService.getByBoMon(
      HomeMainComponent.maBm
    );
    this.GVInputConfig.keyword = 'tenGv';

    this.websocketService.startConnection();
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
              this.oldForm.fileName = response.data.name;
              this.pdfSrc = response.data.download_url;
            });
        });

      this.oldForm = this.nvForm.form.value;
      this.oldForm.thoiDiemKt = this.ngayKt + ' ' + this.thoiGianKt;
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
        formValue.hoTen.tenGv + ': ' + formValue.tenNv,
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
        // await this.setForm();
        this.websocketService.sendForNhiemVu(true);
        this.toastr.success('Thêm nhiệm vụ thành công', 'Thông báo !');
        this.router.navigate(['/home/nhiem-vu/']);
      } catch (error) {
        this.toastr.error('Thêm nhiệm vụ thất bại', 'Thông báo !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
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

        // Get nhiệm vụ
        let nv = await this.nhiemVuService.getById(this.maNv);

        nhiemVu.init(
          this.maNv,
          formValue.tenNv,
          formValue.soLuongDt,
          nv.thoiGianBd,
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
          this.websocketService.sendForNhiemVu(true);

          this.toastr.success('Cập nhập nhiệm vụ thành công', 'Thông báo !');
        } catch (error) {
          this.toastr.error('Cập nhập nhiệm vụ thất bại', 'Thông báo !');
        }
      } else {
        this.toastr.info(
          'Thông tin của bạn không thay đổi kể từ lần cuối',
          'Thông báo !'
        );
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
      this.nvForm.validate('.tb-form');
    }
  }

  onDelete() {
    let option = new Option('#delete');

    option.show('error', () => {});

    option.cancel(() => {});

    option.agree(async () => {
      try {
        await this.nhiemVuService.delete(this.maNv);
        // await this.setForm();
        this.websocketService.sendForNhiemVu(true);
        this.toastr.success('Xóa nhiệm vụ thành công', 'Thông báo !');
        this.router.navigate(['/home/nhiem-vu/']);
      } catch (error) {
        this.toastr.error('Xóa nhiệm vụ thất bại', 'Thông báo !');
      }
    });
  }

  async getGVienById(id: string) {
    return await this.giangVienService.getById(id).then((data) => {
      return data;
    });
  }

  checkDaySmaller() {
    let formValue: any = this.nvForm.form.value;
    let ngayKtControl: any = this.nvForm.form.get('ngayKt');
    let ngayBd = new Date(dateVNConvert(this.ngayBd));
    let ngayKt = new Date(dateVNConvert(formValue.ngayKt));

    ngayKtControl.setValidators([
      this.sharedService.customValidator(
        'smallerDay',
        / /,
        ngayKt.getTime() > ngayBd.getTime() ? true : false
      ),
      Validators.required,
    ]);
    ngayKtControl.updateValueAndValidity();
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
