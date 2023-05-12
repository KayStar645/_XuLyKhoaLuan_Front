import { traoDoiService } from '../../../../services/NghiepVu/traodoi.service';
import { hdGopYService } from './../../../../services/hdGopY.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Form, dateVNConvert } from 'src/assets/utils';
import { vi } from 'date-fns/locale';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DuyetDt } from 'src/app/models/DuyetDt.model';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { HdGopi } from 'src/app/models/HdGopi.model';
import { HomeDanhsachbaitapComponent } from '../home-danhsachbaitap/home-danhsachbaitap.component';
import { Traodoi } from 'src/app/models/VirtualModel/TraodoiModel';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-chitietbaitap',
  templateUrl: './home-chitietbaitap.component.html',
  styleUrls: ['./home-chitietbaitap.component.scss'],
})
export class HomeChitietbaitapComponent {
  maCV = '';
  cviec: CongViec = new CongViec();
  giangVien: GiangVien = new GiangVien();
  thoiHan = '';
  listTraoDoi: Traodoi[] = [];
  baiTap = new Form({
    tenCV: ['', Validators.required],
    yeuCau: ['', Validators.required],
    moTa: ['', Validators.required],
    hanChot: ['', Validators.required],
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
  GVInputConfig: any = {};
  dtForm = new Form({
    nhanXet: [''],
  });
  isUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private traoDoiService: traoDoiService,
    private hdGopYService: hdGopYService,
    private websocketService: WebsocketService,
    private toastService: ToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });
    this.websocketService.startConnection();
    this.isUpdate = window.history.state.isUpdate;

    if (this.maCV !== '-1') {
      this.GVInputConfig.data = await this.giangVienService.getAll();
      this.GVInputConfig.keyword = 'tenGv';

      this.cviec = await this.congViecService.getById(this.maCV);
      this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
      this.catchDateTime();
      this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(
        this.maCV
      );

      this.setForm();

      await this.getComment();
    }
  }

  async onAdd() {
    try {
      let congViec = new CongViec();
      let formValue: any = this.baiTap.form.value;
      congViec.init(
        '0',
        formValue.tenCv,
        formValue.yeuCau,
        formValue.moTa,
        dateVNConvert(formValue.ngayKt),
        0,
        HomeMainComponent.maGV,
        HomeDanhsachbaitapComponent.maDt,
        HomeDanhsachbaitapComponent.maNhom
      );
      await this.congViecService.add(congViec);
      this.toastService.success('Thêm bài tập thành công', 'Thông báo !');
      this.router.navigate([
        '/home/huong-dan/cong-viec',
        { maDt: HomeDanhsachbaitapComponent.maDt },
      ]);
    } catch (error) {
      this.toastService.error('Thêm bài tập thất bại', 'Thông báo !');
      console.log(error);
    }
  }

  async onUpdate() {
    try {
      let congViec = new CongViec();
      let formValue: any = this.baiTap.form.value;
      congViec.init(
        this.maCV,
        formValue.tenCV,
        formValue.yeuCau,
        formValue.moTa,
        dateVNConvert(formValue.hanChot),
        0,
        HomeMainComponent.maGV,
        HomeDanhsachbaitapComponent.maDt,
        HomeDanhsachbaitapComponent.maNhom
      );
      await this.congViecService.update(congViec);
      this.toastService.success('Sửa bài tập thành công', 'Thông báo !');
      this.router.navigate([
        '/home/huong-dan/cong-viec',
        { maDt: HomeDanhsachbaitapComponent.maDt },
      ]);
    } catch (error) {
      this.toastService.error('Sửa bài tập thất bại', 'Thông báo !');
      console.log(error);
    }
  }

  setForm() {
    this.baiTap.form.patchValue({
      tenCV: this.cviec.tenCv,
      yeuCau: this.cviec.yeuCau,
      moTa: this.cviec.moTa,
      hanChot: format(new Date(this.cviec.hanChot), 'dd-MM-yyyy'),
    });
  }

  onDateChange($event: any) {}

  catchDateTime() {
    this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace(
      '-',
      ' tháng '
    );
  }

  async getComment() {
    await this.traoDoiService
      .GetAllTraoDoiMotCongViec(this.maCV)
      .then((data) => {
        this.listTraoDoi = data.map((t: any) => {
          return {
            ...t,
            thoiGian:
              format(new Date(t.thoiGian), 'dd-MM-yyyy') +
              ' (' +
              formatDistanceToNowStrict(new Date(t.thoiGian), {
                locale: vi,
              }) +
              ' trước) ',
          };
        });
      });
  }

  async onAddComment() {
    const formValue: any = this.dtForm.form.value;
    const value: any = formValue.nhanXet;

    if (value) {
      try {
        let gopy = new HdGopi();

        gopy.init(
          value,
          format(new Date(), 'yyyy-MM-dd') +
            'T' +
            format(new Date(), 'HH:mm:ss'),
          this.maCV,
          HomeMainComponent.maGV,
          HomeDanhsachbaitapComponent.maDt
        );

        await this.hdGopYService.add(gopy);
        await this.getComment();
      } catch (error) {}
    }
  }
}
