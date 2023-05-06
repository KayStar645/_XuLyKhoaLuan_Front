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
  khForm = new Form({
    tenCv: ['', Validators.required],
    yeuCau: ['', Validators.required],
    moTa: ['', Validators.required],
    ngayKt: ['', Validators.required],
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

    this.GVInputConfig.data = await this.giangVienService.getAll();
    this.GVInputConfig.keyword = 'tenGv';

    this.cviec = await this.congViecService.getById(this.maCV);
    this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
    this.catchDateTime();
    this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(
      this.maCV
    );

    await this.getComment();

    this.websocketService.startConnection();
  }

  async onAdd() {
    try {
      let congViec = new CongViec();
      let formValue: any = this.khForm.form.value;
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
              t.thoiGian.substr(0, 10) +
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
