import { WebsocketService } from './../../../../services/Websocket.service';
import { traoDoiService } from '../../../../services/NghiepVu/traodoi.service';
import { hdGopYService } from '../../../../services/hdGopY.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { add, format, formatDistanceToNowStrict, compareAsc } from 'date-fns';
import { Form, dateVNConvert, getParentElement } from 'src/assets/utils';
import { vi } from 'date-fns/locale';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { HdGopi } from 'src/app/models/HdGopi.model';
import { HomeDanhsachbaitapComponent } from '../home-danhsachbaitap/home-danhsachbaitap.component';
import { Traodoi } from 'src/app/models/VirtualModel/TraodoiModel';
import { Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { baoCaoService } from 'src/app/services/baoCao.service';
import { BaoCaoVT } from 'src/app/models/VirtualModel/BaoCaoVTModel';

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

  apiHomeworkFiles: any[] = [];
  apiBaoCaos: BaoCaoVT[] = [];
  types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar'];
  defaultHeight: number = 60;

  isUpdate: boolean = false;
  isAdd: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private traoDoiService: traoDoiService,
    private hdGopYService: hdGopYService,
    private websocketService: WebsocketService,
    private toastService: ToastrService,
    private baoCaoService: baoCaoService
  ) {}

  async ngOnInit() {
    this.websocketService.startConnection();
    this.isUpdate = window.history.state.isUpdate;
    this.isAdd = window.history.state.isAdd;

    this.route.params.subscribe(async (params) => {
      this.maCV = params['maCv'];
    });

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

      this.getAllHomeworkFiles();

      await this.getComment();
    }

    this.websocketService.startConnection();
    this.websocketService.receiveFromHuongDanGopY((dataChange: Boolean) => {
      if (dataChange) {
        this.getComment();
      }
    });
  }

  onStudentClick(event: MouseEvent) {
    let element = event.target as HTMLElement;
    let parent: HTMLInputElement = getParentElement(element, '.student');
    let collape: HTMLElement = parent.querySelector('.collapse-block')!;
    let heightAdd = this.defaultHeight + collape.offsetHeight + 16;
    let heightSub = parent.scrollHeight - collape.offsetHeight - 16;

    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
      parent.style.height = `${heightSub}px`;
    } else {
      parent.classList.add('active');
      parent.style.height = `${heightAdd}px`;
    }
  }

  async getAllHomeworkFiles() {
    this.apiBaoCaos = await this.baoCaoService.GetBaocaoByMacv(this.maCV, '');

    this.apiBaoCaos.forEach((file: BaoCaoVT) => {
      let fileSplit: string[] = file.fileBc.split('.')[1].split('-');
      let type = fileSplit[0];
      let item: any = {};

      if (this.types.includes(type)) {
        item['img'] = `../../../../assets/Images/file_type/${type}.png`;
      } else {
        item['img'] = `../../../../assets/Images/file_type/doc.png`;
      }
      item['name'] = file.fileBc.split('.')[0];
      item['type'] = type;
      this.apiHomeworkFiles.push(item);
    });

    this.websocketService.startConnection();
    this.websocketService.receiveFromBaoCao(async (dataChange: boolean) => {
      this.apiHomeworkFiles.splice(0, this.apiHomeworkFiles.length);

      this.apiBaoCaos = await this.baoCaoService.GetBaocaoByMacv(this.maCV, '');

      this.apiBaoCaos.forEach((file: BaoCaoVT) => {
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

  async onAdd() {
    let formValue: any = this.baiTap.form.value;

    try {
      let congViec = new CongViec();
      let formValue: any = this.baiTap.form.value;
      congViec.init(
        '0',
        formValue.tenCV,
        formValue.yeuCau,
        formValue.moTa,
        dateVNConvert(formValue.hanChot),
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
    this.listTraoDoi = await this.traoDoiService.GetAllTraoDoiMotCongViec(
      this.maCV
    );
  }

  format(value: string) {
    let date = new Date(value);
    let dateAdd = add(date, { days: 1 });
    let newValue = format(date, 'dd-MM-yyyy HH:mm');

    if (compareAsc(dateAdd, new Date()) === 1) {
      return (
        formatDistanceToNowStrict(date, {
          locale: vi,
        }) + ' trước'
      );
    }

    return newValue;
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
        this.dtForm.form.patchValue({
          nhanXet: '',
        });
        this.websocketService.sendForHuongDanGopY(true);
      } catch (error) {}
    }
  }
}
