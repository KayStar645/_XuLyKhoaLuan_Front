import { Component, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { congViecService } from 'src/app/services/congViec.service';
import { format, formatDistanceToNowStrict, getDay } from 'date-fns';
import { DashboardComponent } from '../../dashboard.component';
import { thamGiaService } from 'src/app/services/thamGia.service';

@Component({
  selector: 'app-dashboard-mainnhom',
  templateUrl: './dashboard-mainnhom.component.html',
  styleUrls: ['./dashboard-mainnhom.component.scss'],
})
export class DashboardMainnhomComponent {
  nhom: Nhom = new Nhom();
  deTai: DeTai = new DeTai();
  listSV: SinhVien[] = [];
  nearTimeOutMS: any[] = [];
  listBT: any[] = [];
  maDT = '';

  constructor(
    private nhomService: nhomService,
    private deTaiService: deTaiService,
    private sinhVienService: sinhVienService,
    private congViecService: congViecService,
    private thamGiaService: thamGiaService
  ) {}

  @ViewChildren('link') links!: QueryList<ElementRef>;

  async ngOnInit() {
    this.nhom = await this.nhomService.getById(DashboardComponent.maNhom);

    if (DashboardComponent.maDT !== '') {
      this.deTai = await this.deTaiService.getById(DashboardComponent.maDT);
      this.maDT = DashboardComponent.maDT;
      this.listSV = await this.sinhVienService.getSinhvienByDetai(
        DashboardComponent.maDT
      );
      await this.getListBT();
      this.getNearTimeOutMission();
    } else {
      this.listSV = await this.thamGiaService.GetSinhvienByNhom(
        DashboardComponent.maNhom,
        false
      );
    }
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

  async getListBT() {
    await this.congViecService
      .GetCongviecByMadt(DashboardComponent.maDT)
      .then((data) => {
        this.listBT = data.map((bt) => ({
          ...bt,
          thoiHan: format(new Date(bt.hanChot), 'HH:mm dd-MM').replace(
            '-',
            ' tháng '
          ),
        }));
      });
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

  onShowOption(event: any) {
    let element = event.target.closest('.option');

    if (element) {
      element.classList.toggle('active');
    }
  }

  onDeleteJob(event: any) {}
}
