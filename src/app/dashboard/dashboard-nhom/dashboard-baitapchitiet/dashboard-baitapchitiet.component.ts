import { traoDoiService } from './../../../services/traodoi.service';
import { sinhVienService } from './../../../services/sinhVien.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { compareAsc, format, formatDistanceToNowStrict } from 'date-fns';
import { BinhLuan } from 'src/app/models/BinhLuan.model';
import { Form } from 'src/assets/utils';
import { binhLuanService } from 'src/app/services/binhLuan.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DashboardComponent } from '../../dashboard.component';
import { ToastrService } from 'ngx-toastr';
import { baoCaoService } from 'src/app/services/baoCao.service';
import { BaoCao } from 'src/app/models/BaoCao.model';
import { Validators } from '@angular/forms';
import { fi, vi } from 'date-fns/locale';
import { Traodoi } from 'src/app/models/VirtualModel/TraodoiModel';
import { shareService } from 'src/app/services/share.service';

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
  listTraoDoi: Traodoi[] = [];
  isOutDate: number = 1; // Đã nộp
  homeworkFiles: any[] = [];
  apiHomeworkFiles: any[] = [];
  apiBaoCaos: BaoCao[] = [];
  selectedFiles: any[] = [];

  dtForm = new Form({
    nhanXet: ['', Validators.required],
  });

  types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar'];

  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private traoDoiService: traoDoiService,
    private toastService: ToastrService,
    private websocketService: WebsocketService,
    private binhLuanService: binhLuanService,
    private baoCaoService: baoCaoService,
    private sinhVienService: sinhVienService,
    private shareSerivce: shareService
  ) {}

  async ngOnInit() {
    this.getNamhocDot();

    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });
    this.cviec = await this.congViecService.getById(this.maCV);
    this.giangVien = await this.giangVienService.getById(this.cviec.maGv);
    this.catchDateTime();
    this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(
      this.maCV
    );

    this.websocketService.startConnection();
    this.websocketService.receiveFromBinhLuan(async (dataChange: boolean) => {
      if (dataChange) {
        await this.getBinhLuans();
      }
    });

    await this.getBinhLuans();

    await this.getAllHomeworkFiles();

    if (
      compareAsc(new Date(), new Date(this.cviec.hanChot)) === -1 &&
      this.apiHomeworkFiles.length === 0
    ) {
      // Đã nộp nè
      let isOut = false;
      for (let b of this.apiBaoCaos) {
        if (
          compareAsc(new Date(b.thoiGianNop), new Date(this.cviec.hanChot)) ===
          1
        ) {
          isOut = true;
          break;
        }
      }
      if (isOut) {
        this.isOutDate = 1; // Đã nộp
      } else {
        this.isOutDate = 0; // Nộp muộn
      }
    }
  }

  async getBinhLuans() {
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

  async getAllHomeworkFiles() {
    this.apiBaoCaos = await this.baoCaoService.GetBaocaoByMacv(this.maCV);

    this.apiBaoCaos.forEach((file: BaoCao) => {
      let fileSplit: string[] = file.fileBc.split('.');
      let type = fileSplit[fileSplit.length - 1];
      let item: any = {};

      if (this.types.includes(type)) {
        item['img'] = `../../../../assets/Images/file_type/${type}.png`;
      } else {
        item['img'] = `../../../../assets/Images/file_type/doc.png`;
      }
      item['name'] = file.fileBc;
      item['type'] = type;
      this.apiHomeworkFiles.push(item);
    });

    this.websocketService.startConnection();
    this.websocketService.receiveFromBaoCao(async (dataChange: boolean) => {
      this.homeworkFiles.splice(0, this.homeworkFiles.length);
      this.apiHomeworkFiles.splice(0, this.apiHomeworkFiles.length);

      this.apiBaoCaos = await this.baoCaoService.GetBaocaoByMacv(this.maCV);

      this.apiBaoCaos.forEach((file: BaoCao) => {
        let fileSplit: string[] = file.fileBc.split('.');
        let type = fileSplit[fileSplit.length - 1];
        let item: any = {};

        if (this.types.includes(type)) {
          item['img'] = `../../../../assets/Images/file_type/${type}.png`;
        } else {
          item['img'] = `../../../../assets/Images/file_type/doc.png`;
        }
        item['name'] = file.fileBc;
        item['type'] = type;
        this.apiHomeworkFiles.push(item);
      });
    });
  }

  async onConfirmFile(event: any) {
    const files = Array.from(event.target.files);

    files.forEach((file: any) => {
      let fileSplit: string[] = file.name.split('.');
      let type = fileSplit[fileSplit.length - 1];
      let item: any = {};

      if (this.types.includes(type)) {
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

  async onSubmitHomeWork() {
    if (this.selectedFiles.length > 0) {
      try {
        for (var file of this.selectedFiles) {
          await this.addBaoCao(file);
          this.toastService.success('Nộp báo cáo thành công', 'Thông báo !');
          this.websocketService.sendForBaoCao(true);
        }
      } catch (error) {
        this.toastService.error('Nộp báo cáo thất bại', 'Thông báo!');
      }
    } else {
      this.toastService.warning('Vui lòng thêm file đi kèm', 'Thông báo !');
    }
  }

  async addBaoCao(file: any) {
    let currDate = new Date();
    let thoiGianNop =
      format(currDate, 'yyyy-MM-dd') +
      'T' +
      format(currDate, 'HH:mm:ss') +
      '.000Z';

    let baoCao = new BaoCao();
    baoCao.init(
      this.maCV,
      DashboardComponent.maSV,
      this.namHoc,
      this.dot,
      thoiGianNop,
      file.name
    );

    await this.shareSerivce.createFolderAndUploadFile(
      `Homework/${this.giangVien.maGv}`,
      file
    );
    // await this.baoCaoService.add(baoCao);
  }

  async getNameSinhvien(maSv: string) {
    let sv = await this.sinhVienService.getById(maSv);
    return sv.maSv + ' - ' + sv.tenSv;
  }

  getNamhocDot() {
    let maNhom = DashboardComponent.maNhom;
    this.namHoc = maNhom.substring(10, 19);
    this.dot = parseInt(maNhom.substring(maNhom.length - 1));
  }
}
