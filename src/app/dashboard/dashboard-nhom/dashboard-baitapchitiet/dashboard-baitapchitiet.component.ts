import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import {
  compareAsc,
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form } from 'src/assets/utils';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DashboardComponent } from '../../dashboard.component';
import { ToastrService } from 'ngx-toastr';
import { baoCaoService } from 'src/app/services/baoCao.service';
import { BaoCao } from 'src/app/models/BaoCao.model';
import { Validators } from '@angular/forms';
import { vi } from 'date-fns/locale';

@Component({
  selector: 'app-dashboard-baitapchitiet',
  templateUrl: './dashboard-baitapchitiet.component.html',
  styleUrls: ['./dashboard-baitapchitiet.component.scss'],
})
export class DashboardBaitapchitietComponent {
  maCV = '';
  namHoc = '';
  dot = -1;
  cviec: CongViec = new CongViec();
  giangVien: GiangVien = new GiangVien();
  thoiHan = '';
  listBinhLuan: any[] = [];
  isOutDate: boolean = true;
  homeworkFiles: any[] = [];

  dtForm = new Form({
    nhanXet: ['', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private binhLuanService: binhLuanService,
    private toastService: ToastrService,
    private websocketService: WebsocketService,
    private baoCaoService: baoCaoService
  ) {}

  async ngOnInit() {
    this.getNamhocDot();

    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });
    this.cviec = await this.congViecService.getById(this.maCV);
    this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
    this.catchDateTime();
    this.listBinhLuan = (await this.binhLuanService.getAll()).filter(
      (bl) => bl.maCv == this.maCV
    );

    this.websocketService.startConnection();
    this.websocketService.receiveFromBinhLuan(async (dataChange: boolean) => {
      if (dataChange) {
        await this.getBinhLuans();
      }
    });

    if (compareAsc(new Date(), new Date(this.cviec.hanChot)) === 1) {
      this.isOutDate = true;
    }
    await this.getBinhLuans();
  }

  async getBinhLuans() {
    this.listBinhLuan = (await this.binhLuanService.getAll())
      .filter((t) => t.maCv === this.maCV)
      .map((t: any) => ({
        ...t,
        thoiGian: formatDistanceToNow(new Date(t.thoiGian), { locale: vi }),
      }));

    console.log(this.listBinhLuan);
  }

  catchDateTime() {
    this.thoiHan = format(new Date(this.cviec.hanChot), 'HH:mm dd-MM').replace(
      '-',
      ' tháng '
    );
  }

  async onAddComment() {
    if (this.dtForm.form.valid) {
      let formValue: any = this.dtForm.form.value;
      let binhLuan = new BinhLuan();

      binhLuan.dot = this.dot;
      binhLuan.id = 0;
      binhLuan.maCv = this.maCV;
      binhLuan.maSv = DashboardComponent.maSV;
      binhLuan.namHoc = this.namHoc;
      binhLuan.noiDung = formValue.nhanXet;
      binhLuan.thoiGian =
        format(new Date(), 'yyyy-MM-dd') +
        'T' +
        format(new Date(), 'HH:mm:ss') +
        '.000Z';

      try {
        await this.binhLuanService.add(binhLuan);
        this.websocketService.sendForBinhLuan(true);
        this.dtForm.form.patchValue({
          nhanXet: '',
        });
      } catch (error) {
        this.toastService.error('Nhận xét thất bại', 'Thông báo');
      }
    } else {
      this.toastService.warning('Nội dung không được để trống', 'Thông báo !');
    }
  }

  async onConfirmFile(event: any) {
    const files = Array.from(event.target.files);
    let types = [
      'xlsx',
      'jpg',
      'png',
      'pptx',
      'sql',
      'docx',
      'txt',
      'pdf',
      'rar',
    ];

    files.forEach((file: any) => {
      let fileSplit: string[] = file.name.split('.');
      let type = fileSplit[fileSplit.length - 1];
      let item: any = {};

      if (types.includes(type)) {
        item['img'] = `../../../../assets/Images/file_type/${type}.png`;
      } else {
        item['img'] = `../../../../assets/Images/file_type/doc.png`;
      }

      item['name'] = file.name;
      item['type'] = type;

      this.homeworkFiles.push(item);
    });
  }

  async onAddFile() {
    let input: any = document.querySelector('.home-work input');

    input.click();
  }

  onRemveFileItem(event: any, name: String) {
    let index = this.homeworkFiles.findIndex((t) => t.name === name);

    this.homeworkFiles.splice(index, 1);
  }

  onSubmitHomeWork() {
    if (this.homeworkFiles.length > 0) {
      try {
        this.homeworkFiles.forEach(async (file) => {
          let baoCao = new BaoCao();
          let currDate = new Date();

          baoCao.dot = this.dot;
          baoCao.fileBc = file.name;
          baoCao.lanNop = 1;
          baoCao.maCv = this.maCV;
          baoCao.maSv = DashboardComponent.maSV;
          baoCao.namHoc = this.namHoc;
          baoCao.thoiGianNop =
            format(currDate, 'yyyy-MM-dd') +
            'T' +
            format(currDate, 'HH:mm:ss') +
            '.000Z';

          await this.baoCaoService.add(baoCao);
          this.toastService.success('Nộp báo cáo thành công', 'Thông báo !');
        });
      } catch (error) {
        this.toastService.error('Nộp báo cáo thất bại', 'Thông báo !');
      }
    } else {
      this.toastService.warning('Vui lòng thêm file đi kèm', 'Thông báo !');
    }
  }

  getNamhocDot() {
    let maNhom = DashboardComponent.maNhom;
    this.namHoc = maNhom.substring(10, 19);
    this.dot = parseInt(maNhom.substring(maNhom.length - 1));
  }
}
