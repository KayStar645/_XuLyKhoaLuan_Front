import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { CongViec } from 'src/app/models/CongViec.model';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { congViecService } from 'src/app/services/congViec.service';
import { shareService } from 'src/app/services/share.service';
import { Form, Option, dateVNConvert } from 'src/assets/utils';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home-chitietbaitap',
  templateUrl: './home-chitietbaitap.component.html',
  styleUrls: ['./home-chitietbaitap.component.scss'],
})
export class HomeChitietbaitapComponent {
  maCv: string = '';
  maDt: string = "";
  oldForm: any;
  pdfSrc: any;
  congViec: CongViec = new CongViec();
  cvForm = new Form({
    maCv: ['', Validators.required],
    tenCv: ['', Validators.required],
    yeuCau: ['', Validators.required],
    moTa: [''],
    hanChot: ['', Validators.required],
  });

  ngayKt: string = format(new Date(), 'dd-MM-yyyy');
  thoiGianKt: string = '00:00:00';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: shareService,
    private congViecService: congViecService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maCv = params['maCv'];
      this.maDt = params["maDt"];
      await this.setForm();
    });

    this.websocketService.startConnection();
  }

  async setForm() {
    // if (this.maCv) {
    //   await this.congViecService.getById(this.maCv).then(async (data) => {
    //     this.congViec = data;
    //     this.ngayKt = format(new Date(this.congViec.hanChot), 'dd-MM-yyyy');
    //     this.thoiGianKt = format(new Date(this.congViec.hanChot), 'HH:mm');

    //     this.cvForm.form.patchValue({
    //       ...this.congViec,
    //       ngayKt: this.ngayKt,
    //       thoiGianKt: this.thoiGianKt,
    //       hoTen: (await this.getGVienById(this.congViec.maGv)).tenGv,
    //     });

    //     return this.congViec;
    //   });

    //   this.oldForm = this.cvForm.form.value;
    //   this.oldForm.hanChot = this.ngayKt + ' ' + this.thoiGianKt;
    // } else {
    //   this.maCv = '';
    //   this.cvForm.resetForm('.cv-form');

    //   this.cvForm.form.patchValue({
    //     hanChot: '23:59',
    //   });
    // }
  }

  onChange(event: any) {
    let $img: any = event.target;

    this.cvForm.form.patchValue({
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
    // if (this.cvForm.form.valid) {
    //   let congViec = new CongViec();
    //   let file: any = document.querySelector('.attach-file');
    //   let formValue: any = this.cvForm.form.value;
    //   congViec.init(
    //     formValue.maCv,
    //     formValue.tenCv,
    //     formValue.yeuCau,
    //     formValue.moTa,
    //     dateVNConvert(formValue.ngayKt) + 'T' + formValue.thoiGianKt + '.000Z',
    //     null,
    //     localStorage.getItem("id"),
    //     this.maDt,

    //   );
    //   console.log(congViec);
    //   try {
    //     if (file && file.files[0]) {
    //       await this.sharedService.uploadFile(
    //         file.files[0],
    //         environment.githubMissionFilesAPI
    //       );
    //     }
    //     await this.congViecService.add(congViec);
    //     await this.setForm();
    //     this.websocketService.sendForNhiemVu(true);
    //     this.toastr.success('Thêm nhiệm vụ thành công', 'Thông báo !');
    //     this.router.navigate(['/home/nhiem-vu/chi-tiet', { maCv: -1 }]);
    //   } catch (error) {
    //     this.toastr.error('Thêm nhiệm vụ thất bại', 'Thông báo !');
    //   }
    // } else {
    //   this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
    //   this.cvForm.validate('.tb-form');
    // }
  }

  setSelectedNV(event: any) {
    this.cvForm.form.patchValue({
      maGv: event.maGv,
      maBm: event.maBm,
    });
  }

  async onUpdate() {
    // if (this.cvForm.form.valid) {
    //   if (
    //     JSON.stringify(this.oldForm) !== JSON.stringify(this.cvForm.form.value)
    //   ) {
    //     let congViec = new CongViec();
    //     let file: any = document.querySelector('.attach-file');
    //     let formValue: any = this.cvForm.form.value;
    //     congViec.init(
    //       this.maCv,
    //       formValue.tenNv,
    //       formValue.soLuongDt,
    //       formValue.thoiDiemBd,
    //       dateVNConvert(formValue.ngayKt) +
    //         'T' +
    //         formValue.thoiGianKt +
    //         '.000Z',
    //       formValue.fileNv,
    //       formValue.maBm,
    //       formValue.maGv
    //     );

    //     try {
    //       if (file && file.files[0]) {
    //         await this.sharedService.uploadFile(
    //           file.files[0],
    //           environment.githubMissionFilesAPI
    //         );
    //       }
    //       await this.congViecService.update(congViec);
    //       this.websocketService.sendForNhiemVu(true);

    //       this.toastr.success('Cập nhập nhiệm vụ thành công', 'Thông báo !');
    //     } catch (error) {
    //       this.toastr.error('Cập nhập nhiệm vụ thất bại', 'Thông báo !');
    //     }
    //   } else {
    //     this.toastr.info(
    //       'Thông tin của bạn không thay đổi kể từ lần cuối',
    //       'Thông báo !'
    //     );
    //   }
    // } else {
    //   this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
    //   this.cvForm.validate('.tb-form');
    // }
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
        await this.congViecService.delete(this.maCv);
        await this.setForm();
        this.websocketService.sendForNhiemVu(true);
        this.toastr.success('Xóa nhiệm vụ thành công', 'Thông báo !');
        this.router.navigate(['/home/nhiem-vu/']);
      } catch (error) {
        this.toastr.error('Xóa nhiệm vụ thất bại', 'Thông báo !');
      }
      _delete.classList.remove('active');
    });
  }

  async getGVienById(id: string) {
    // return await this.giangVienService.getById(id).then((data) => {
    //   return data;
    // });
  }

  checkDaySmaller() {
    // let formValue: any = this.cvForm.form.value;
    // let ngayKtControl: any = this.cvForm.form.get('ngayKt');
    // let ngayKt = new Date(dateVNConvert(formValue.ngayKt));

    // ngayKtControl.setValidators([
    //   this.sharedService.customValidator(
    //     'smallerDay',
    //     / /,
    //     ngayKt.getTime() > ngayBd.getTime() ? true : false
    //   ),
    //   Validators.required,
    // ]);
    // ngayKtControl.updateValueAndValidity();
    // this.cvForm.validateSpecificControl(['ngayKt', 'thoiGianKt']);
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
