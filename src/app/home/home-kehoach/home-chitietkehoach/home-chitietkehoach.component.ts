import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { format, formatDistanceStrict, getMilliseconds } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { async, debounceTime, Subject } from 'rxjs';
import { KeHoach } from 'src/app/models/KeHoach.model';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { boMonService } from 'src/app/services/boMon.service';
import { keHoachService } from 'src/app/services/keHoach.service';
import { khoaService } from 'src/app/services/khoa.service';
import { shareService } from 'src/app/services/share.service';
import { dateVNConvert, Form, Option } from 'src/assets/utils';
import { environment } from 'src/environments/environment.prod';
import { HomeMainComponent } from '../../home-main/home-main.component';

@Component({
  selector: 'app-home-chitietkehoach',
  templateUrl: './home-chitietkehoach.component.html',
  styleUrls: ['./home-chitietkehoach.component.scss'],
})
export class HomeChitietkehoachComponent {
  maKh: number = -1;
  oldForm: any;
  pdfSrc: any;
  keHoach: KeHoach = new KeHoach();
  KhoaInputConfig: any = {};
  BMInputConfig: any = {};
  isTruongK: boolean = false;

  khForm = new Form({
    tenKh: ['', Validators.required],
    soLuongDt: ['', [Validators.required, Validators.min(1)]],
    thoiDiemBd: [''],
    ngayKt: ['', Validators.required],
    thoiGianKt: ['', Validators.required],
    fileKh: ['error.pdf'],
    maBm: ['', Validators.required],
    // maKhoa: ['', Validators.required],
    // tenKhoa: ['', Validators.required],
    tenBm: ['', Validators.required],
  });

  ngayBd: string = '';
  ngayKt: string = format(new Date(), 'dd-MM-yyyy');
  thoiGianKt: string = '00:00:00';
  maKhoa = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private sharedService: shareService,
    private keHoachService: keHoachService,
    private khoaService: khoaService,
    private boMonService: boMonService,
    private toastr: ToastrService,
    private router: Router,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maKh = parseInt(params['maKh']);
      await this.setForm();
    });

    this.isTruongK = HomeMainComponent.maKhoa == null ? false : true;

    await this.khoaService.getAll().then((data) => {
      this.KhoaInputConfig.data = data;
      this.KhoaInputConfig.keyword = 'tenKhoa';
      this.KhoaInputConfig.notFound = 'Không tìm thấy khoa';
    });

    await this.boMonService.getAll().then((data) => {
      this.BMInputConfig.data = data;
      this.BMInputConfig.keyword = 'tenBm';
      this.KhoaInputConfig.notFound = 'Không tìm bộ môn';
    });

    this.websocketService.startConnection();

    this.maKhoa.pipe(debounceTime(800)).subscribe((tenKhoa) => {
      let id: any;

      this.khoaService.getAll().then((data) => {
        id = data.find((t) => t.tenKhoa === tenKhoa)?.maKhoa;
      });
      this.boMonService.getAll().then((data) => {
        this.BMInputConfig.data = data.filter((item) => item.maKhoa === id);
      });
    });
  }

  onSearchKhoaChange(event: any) {
    this.maKhoa.next(event);
  }

  async setForm() {
    if (this.maKh > 0) {
      await this.keHoachService
        .getById(this.maKh)
        .then(async (data) => {
          this.keHoach = data;
          this.ngayBd = format(new Date(this.keHoach.thoiGianBd), 'dd-MM-yyyy');
          this.ngayKt = format(new Date(this.keHoach.thoiGianKt), 'dd-MM-yyyy');
          this.thoiGianKt = format(
            new Date(this.keHoach.thoiGianKt),
            'HH:mm:ss'
          );

          this.khForm.form.patchValue({
            ...this.keHoach,
            ngayKt: this.ngayKt,
            thoiGianKt: this.thoiGianKt,
            tenKhoa: (await this.getKhoaById(this.keHoach.maKhoa)).tenKhoa,
            tenBm: (await this.getBMById(this.keHoach.maBm)).tenBm,
          });

          return this.keHoach;
        })
        .then((response) => {
          axios
            .get(environment.githubPlanFilesAPI + response.fileKh)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });
        });

      this.oldForm = this.khForm.form.value;
    } else {
      this.ngayBd = format(new Date(), 'dd-MM-yyyy');
      this.maKh = -1;
      this.khForm.resetForm('.tb-form');
      this.pdfSrc = 'https:/error.pdf';

      this.khForm.form.patchValue({
        thoiGianKt: '23:59:00',
        soLuongDt: 1,
      });
    }
  }

  onChange(event: any) {
    let $img: any = event.target;

    this.khForm.form.patchValue({
      fileKh: event.target.files[0].name,
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
    if (this.khForm.form.valid) {
      let keHoach = new KeHoach();
      let file: any = document.querySelector('.attach-file');
      let formValue: any = this.khForm.form.value;
      keHoach.init(
        0,
        formValue.maBm + ': ' +formValue.tenKh,
        formValue.soLuongDt,
        format(new Date(), 'yyyy-MM-dd'),
        dateVNConvert(formValue.ngayKt) + 'T' + formValue.thoiGianKt + '.000Z',
        formValue.fileKh,
        HomeMainComponent.maKhoa,
        formValue.maBm
      );
      try {
        if (file && file.files[0]) {
          await this.sharedService.uploadFile(
            file.files[0],
            environment.githubPlanFilesAPI
          );
        }
        await this.keHoachService.add(keHoach);
        await this.setForm();
        this.websocketService.sendForKeHoach(true);

        this.toastr.success('Thêm kế hoạch thành công', 'kế hoạch !');
        this.router.navigate(['/home/ke-hoach/chi-tiet', { maKh: -1 }]);
      } catch (error) {
        this.toastr.error('Thêm kế hoạch thất bại', 'kế hoạch !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Kế hoạch !');
      this.khForm.validate('.tb-form');
    }
  }

  async onUpdate() {
    if (this.khForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) !== JSON.stringify(this.khForm.form.value)
      ) {
        let keHoach = new KeHoach();
        let file: any = document.querySelector('.attach-file');
        let formValue: any = this.khForm.form.value;
        keHoach.init(
          this.maKh,
          formValue.tenKh,
          formValue.soLuongDt,
          dateVNConvert(this.ngayBd),
          dateVNConvert(formValue.ngayKt) +
            'T' +
            formValue.thoiGianKt +
            '.000Z',
          formValue.fileKh,
          HomeMainComponent.maKhoa,
          formValue.maBm
        );

        try {
          if (file && file.files[0]) {
            await this.sharedService.uploadFile(
              file.files[0],
              environment.githubPlanFilesAPI
            );
          }
          await this.keHoachService.update(keHoach);
          this.websocketService.sendForKeHoach(true);

          this.toastr.success('Cập nhập kế hoạch thành công', 'kế hoạch !');
        } catch (error) {
          this.toastr.error('Cập nhập kế hoạch thất bại', 'kế hoạch !');
        }
      } else {
        this.toastr.info(
          'Thông tin của bạn không thay đổi kể từ lần cuối',
          'kế hoạch !'
        );
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Kế hoạch !');
      this.khForm.validate('.tb-form');
    }
  }

  onDelete() {
    let option = new Option('#delete');

    option.show('error', () => {});

    option.cancel(() => {});

    option.agree(async () => {
      try {
        await this.keHoachService.delete(this.maKh);
        this.websocketService.sendForKeHoach(true);

        this.toastr.success('Xóa kế hoạch thành công', 'Kế hoạch !');
        this.router.navigate(['/home/ke-hoach/']);
      } catch (error) {
        this.toastr.error('Xóa kế hoạch thất bại', 'Kế hoạch !');
      }
    });
  }

  async setSelectedKhoa(event: any) {
    this.khForm.form.patchValue({
      maKhoa: event.maKhoa,
    });

    await this.boMonService.getAll().then((data) => {
      this.BMInputConfig.data = data.filter(
        (item) => item.maKhoa === event.maKhoa
      );
    });
  }

  setSelectedBM(event: any) {
    this.khForm.form.patchValue({
      maBm: event.maBm,
    });
  }

  async getKhoaById(id: string) {
    return await this.khoaService.getById(id).then((data) => {
      return data;
    });
  }

  async getBMById(id: string) {
    return await this.boMonService.getById(id).then((data) => {
      return data;
    });
  }

  checkDaySmaller() {
    let formValue: any = this.khForm.form.value;
    let ngayKtControl: any = this.khForm.form.get('ngayKt');
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
    this.khForm.validateSpecificControl(['ngayKt', 'thoiGianKt']);
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
