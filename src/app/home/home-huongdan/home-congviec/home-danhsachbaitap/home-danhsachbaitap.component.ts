import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { DeTai } from 'src/app/models/DeTai.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { congViecService } from 'src/app/services/congViec.service';
import { deTaiService } from 'src/app/services/deTai.service';
import { nhomService } from 'src/app/services/nhom.service';
import { Option, getParentElement } from 'src/assets/utils';
import { HomeCongviecComponent } from '../home-congviec.component';
import { format, formatDistanceToNowStrict, getDay } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { sinhVienService } from 'src/app/services/sinhVien.service';

@Component({
  selector: 'app-home-danhsachbaitap',
  templateUrl: './home-danhsachbaitap.component.html',
  styleUrls: ['./home-danhsachbaitap.component.scss'],
})
export class HomeDanhsachbaitapComponent implements OnInit {
  maDT: string = '';
  static maDt: string = '';
  static maNhom: string = '';
  nearTimeOutMS: any[] = [];
  listBT: any[] = [];
  listSV: any[] = [];
  nhom: Nhom = new Nhom();
  deTai: DeTai = new DeTai();

  constructor(
    private deTaiService: deTaiService,
    private toastService: ToastrService,
    private nhomService: nhomService,
    private congViecService: congViecService,
    private activeRoute: ActivatedRoute,
    private sinhVienService: sinhVienService
  ) {}

  async ngOnInit(): Promise<void> {
    this.activeRoute.paramMap.subscribe((params) => {
      this.maDT = params.get('maDt')!;
      if (this.maDT) {
        HomeCongviecComponent.maDT = params.get('maDt')!;
      } else {
        this.maDT = HomeCongviecComponent.maDT;
      }
    });

    await this.getListBT();

    this.nhom = await this.nhomService.GetNhomByMadtAsync(this.maDT);
    this.listSV = (
      await this.sinhVienService.getSinhvienByDetai(this.maDT)
    ).map((t) => ({
      ...t,
      gioiTinh: t.gioiTinh ? t.gioiTinh : 'Nam',
    }));
    this.deTai = await this.deTaiService.getById(this.maDT);

    this.getNearTimeOutMission();
    this.closeOption();

    HomeDanhsachbaitapComponent.maDt = this.maDT;
    HomeDanhsachbaitapComponent.maNhom = this.nhom.maNhom;
  }

  async getListBT() {
    await this.congViecService.GetCongviecByMadt(this.maDT).then((data) => {
      this.listBT = data.map((bt) => ({
        ...bt,
        thoiHan: format(new Date(bt.hanChot), 'HH:mm dd-MM').replace(
          '-',
          ' tháng '
        ),
      }));
    });
  }

  getNearTimeOutMission() {
    this.nearTimeOutMS = this.listBT
      .filter((nv: any) => {
        let date = new Date(nv.hanChot);
        let dateBetween = parseInt(
          formatDistanceToNowStrict(date, {
            unit: 'day',
          }).split(' ')[0]
        );

        nv['thoiGianKt2'] = format(new Date(nv.hanChot), 'HH:mm');

        let dayOfWeek = getDay(date) + 1;

        switch (dayOfWeek) {
          case 2:
            nv['thu'] = 'Thứ Hai';
            nv['number'] = 2;
            break;
          case 3:
            nv['thu'] = 'Thứ Ba';
            nv['number'] = 3;
            break;
          case 4:
            nv['thu'] = 'Thứ Tư';
            nv['number'] = 4;
            break;
          case 5:
            nv['thu'] = 'Thứ Năm';
            nv['number'] = 5;
            break;
          case 6:
            nv['thu'] = 'Thứ Sáu';
            nv['number'] = 6;
            break;
          case 7:
            nv['thu'] = 'Thứ Bảy';
            nv['number'] = 7;
            break;

          default:
            nv['thu'] = 'Chủ Nhật';
            nv['number'] = 1;
            break;
        }

        return dateBetween <= 7;
      })
      .sort((a, b) => a.number - b.number);
  }

  closeOption() {
    window.addEventListener('click', (e: any) => {
      let option = e.target.closest('.option');

      if (!option) {
        document.querySelector('.option.active')?.classList.remove('active');
      }
    });
  }

  onShowOption(event: any) {
    let element = event.target.closest('.option');

    if (element) {
      element.classList.toggle('active');
    }
  }

  onShowMore(event: any) {
    let parent = event.target.closest('.list-item');
    let option = event.target.closest('.option');
    let activeItem = document.querySelector('.list-item.active');

    if (!option) {
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
      } else {
        if (activeItem) {
          activeItem.classList.remove('active');
        }
        parent.classList.add('active');
      }
    }
  }

  async onDeleteJob(maCv: string) {
    let option = new Option('#create');

    option.show('warning');

    option.agree(async () => {
      try {
        await this.congViecService.delete(maCv);
        this.toastService.success('Xóa công việc thành công', 'thông báo !');
      } catch (error) {
        this.toastService.error('Xóa công việc thất bại', 'Thông báo !');
      }
      await this.getListBT();
    });

    option.cancel(() => {});
  }
}
