import { phanBienService } from 'src/app/services/phanBien.service';
import { huongDanService } from 'src/app/services/huongDan.service';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
  subDays,
  addDays,
  isToday,
  isPast,
} from 'date-fns';
import { DatePickerComponent } from 'ng2-date-picker';
import { ToastrService } from 'ngx-toastr';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { DeTai } from 'src/app/models/DeTai.model';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { PhanBien } from 'src/app/models/PhanBien.model';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { deTaiService } from 'src/app/services/deTai.service';
import { Form, dateVNConvert } from 'src/assets/utils';
import { shareService } from 'src/app/services/share.service';

type date = {
  start: Date;
  end: Date;
};

type time = {
  hour: number;
  minute: number;
  rowSpan?: number;
  day?: number;
  name?: string;
  place?: string;
  hourEnd?: number;
  minuteEnd?: number;
  index?: number;
  status?: 'past' | 'today' | 'future';
  type?: 'Hướng dẫn' | 'Phản biện' | 'Hội đồng';
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnChanges {
  @ViewChild('dayPicker')
  datePicker!: DatePickerComponent;

  // Props
  @Input() data: LichPhanBien[] = [];
  @Input() isStudent: boolean = false;
  @Input() maGv!: string;

  // Component
  currDate: Date = new Date();
  rootDate: Date = new Date();

  dates: date[] = [];
  schedule: LichPhanBien[] = [];

  startOfWeek!: Date;
  endOfWeek!: Date;

  dateOfWeek: Date[] = [];
  dateInWeek: date[] = [];

  maxDate!: date;
  minDate!: date;

  times: time[] = [];

  lich: Form = new Form({
    ngayHienTai: [''],
    ngayBD: [''],
    TGBatDau: [''],
    TGKetThuc: [''],
    diaDiem: [''],
  });
  loaiLich: any[] = [];
  deTais: DeTai[] = [];
  deTai: DeTai[] = [];

  constructor(
    private huongDanService: huongDanService,
    private phanBienService: phanBienService,
    private toastService: ToastrService,
    private deTaiService: deTaiService,
    private lichPhanBienService: lichPhanBienService
  ) {}

  async ngOnInit(): Promise<void> {
    this.deTais = [];
  }

  ngOnChanges(): void {
    this.setSchedule();
  }

  async onSelectType(event: any) {
    // Thay đổi loại lịch khi thêm nè
    console.log(this.maGv);
    this.deTais = await this.lichPhanBienService.GetSelectDetaiByGiangVien(
      this.maGv,
      shareService.namHoc,
      shareService.dot,
      event.id
    );
  }

  removeRightCell() {
    let table: HTMLTableElement = document.querySelector('.table')!;
    let cells: HTMLTableCellElement[] = [];

    Array.from(table.rows).forEach((row) => {
      if (row.cells.namedItem('rowSpan')) {
        cells.push(row.cells.namedItem('rowSpan')!);
      }
    });

    cells.forEach((cell) => {
      let count = 0;
      let start = parseInt(cell.dataset.index!);
      for (let i = start + 2; i <= this.times.length; i++) {
        if (count < cell.rowSpan - 1) {
          if (table.rows[i]) {
            table.rows[i].deleteCell(table.rows[i].cells.length - 1);
            count++;
          }
        } else {
          break;
        }
      }
    });
  }

  onSelectDate($event: any) {
    let formValue: any = this.lich.form.value;

    this.rootDate = new Date(dateVNConvert(formValue.ngayHienTai));
    this.setSchedule();
  }

  setSchedule() {
    this.getWeek();
    this.getDate();
    this.getDateInWeekFromData();
    this.getHours();
    this.getSchedule();

    setTimeout(() => {
      this.removeRightCell();
    }, 1);
  }

  onClickPrev() {
    this.rootDate = subDays(this.rootDate, 7);

    this.setSchedule();
  }

  onClickCurrent() {
    this.rootDate = this.currDate;

    this.setSchedule();
  }

  onClickNext() {
    this.rootDate = addDays(this.rootDate, 7);

    this.setSchedule();
  }

  getDate() {
    this.data.forEach((lich) => {
      this.dates.push({
        start: new Date(lich.thoiGianBD),
        end: new Date(lich.thoiGianKT),
      });
    });
  }

  getDateInWeekFromData() {
    this.dateInWeek = [];
    this.schedule = [];

    this.dates.forEach((date) => {
      if (
        isWithinInterval(date.start, {
          start: this.startOfWeek,
          end: this.endOfWeek,
        })
      ) {
        this.dateInWeek.push(date);
      }
    });

    this.data.forEach((lich) => {
      if (
        isWithinInterval(new Date(lich.thoiGianBD), {
          start: this.startOfWeek,
          end: this.endOfWeek,
        })
      ) {
        this.schedule.push(lich);
      }
    });
  }

  getHours() {
    let dateStart = this.dateInWeek.map((t) => t.start);
    let dateEnd = this.dateInWeek.map((t) => t.end);

    let start = this.getSmallestTime(dateStart).hour;
    let end = this.getBiggestTime(dateEnd).hour;

    this.times = [];

    for (let i = start; i <= end; i++) {
      let minute = 0;

      this.times.push({
        hour: i,
        minute: minute,
      });

      this.times.push({
        hour: i,
        minute: (minute += 15),
      });

      this.times.push({
        hour: i,
        minute: (minute += 15),
      });

      this.times.push({
        hour: i,
        minute: (minute += 15),
      });
    }
  }

  getSchedule() {
    this.schedule.forEach((lich) => {
      let dateStart = new Date(lich.thoiGianBD);
      let dateEnd = new Date(lich.thoiGianKT);

      let hourStart = dateStart.getHours();
      let minuteStart = dateStart.getMinutes();

      let time = this.times.find(
        (t) => t.hour === hourStart && t.minute === minuteStart
      );
      let index = this.times.findIndex(
        (t) => t.hour === hourStart && t.minute === minuteStart
      );

      if (time) {
        let hourEnd = dateEnd.getHours();
        let minuteEnd = dateEnd.getMinutes();
        let minuteBonus =
          this.getPartOf45(minuteEnd) - this.getPartOf45(minuteStart);

        if (isToday(dateStart)) {
          time.status = 'today';
        } else if (isPast(dateStart)) {
          time.status = 'past';
        } else {
          time.status = 'future';
        }

        if (lich.loaiLich === 1) {
          time.type = 'Hướng dẫn';
        } else if (lich.loaiLich === 2) {
          time.type = 'Phản biện';
        } else {
          time.type = 'Hội đồng';
        }

        time.rowSpan = (hourEnd - hourStart) * 4 + 1 + minuteBonus;
        time.day = dateStart.getDay();
        time.hourEnd = hourEnd;
        time.minuteEnd = minuteEnd;
        time.name = lich.tenDeTai;
        time.place = lich.diaDiem;
        time.index = index;
      }
    });
  }

  getPartOf45(value: number) {
    let result = 0;

    if (45 % value === 0 && 45 / value != 1) {
      result += 1;
    } else if ((value % 2) % 45 === 0) {
      result += 2;
    } else {
      result += 3;
    }

    return result;
  }

  getWeek() {
    this.startOfWeek = startOfWeek(this.rootDate, {
      weekStartsOn: 1,
    });

    this.endOfWeek = endOfWeek(this.rootDate, {
      weekStartsOn: 1,
    });

    this.dateOfWeek = eachDayOfInterval({
      start: this.startOfWeek,
      end: this.endOfWeek,
    });
  }

  async addSchedule() {
    try {
      let formValue: any = this.lich.form.value;
      let ngayLap = dateVNConvert(formValue.ngayBD);

      switch (this.loaiLich[0].id) {
        case 1: {
          let lich = new HuongDan();

          lich.diaDiem = formValue.diaDiem;
          lich.duaRaHd = false;
          lich.maDt = this.deTai[0].maDT;
          lich.maGv = HomeMainComponent.maGV;
          lich.thoiGianBD = ngayLap + 'T' + formValue.TGBatDau + '.000Z';
          lich.thoiGianKT = ngayLap + 'T' + formValue.TGKetThuc + '.000Z';

          await this.huongDanService.update(lich);
          break;
        }
        case 2: {
          let lich = new PhanBien();

          lich.diaDiem = formValue.diaDiem;
          lich.duaRaHd = false;
          lich.maDt = this.deTai[0].maDT;
          lich.maGv = HomeMainComponent.maGV;
          lich.thoiGianBD = ngayLap + 'T' + formValue.TGBatDau + '.000Z';
          lich.thoiGianKT = ngayLap + 'T' + formValue.TGKetThuc + '.000Z';

          await this.phanBienService.update(lich);
          break;
        }

        default:
          break;
      }
      this.toastService.success('Thêm lịch thành công', 'Thông báo !');
    } catch (error) {
      this.toastService.error('Thêm lịch thất bại', 'Thông báo !');
    }
  }

  onShowFormAdd() {
    document.documentElement.classList.add('no-scroll');
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.add('active');
    create.classList.add('active');
    this.lich.resetForm('#create_box');
  }

  handleToggleAdd() {
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.remove('active');
    create.classList.remove('active');
    document.documentElement.classList.remove('no-scroll');
  }

  format(date: Date, formatString: string = 'dd-MM-yyyy') {
    return format(date, formatString);
  }

  compareDate(date1: Date, date2: Date = this.currDate) {
    let date11 = this.format(date1);
    let date22 = this.format(date2);

    return date11 === date22 ? true : false;
  }

  getSmallestTime(dates: Date[]): time {
    let smallestTime = 0;

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const time = hours * 60 + minutes;
      if (smallestTime === 0 || time < smallestTime) {
        smallestTime = time;
      }
    }

    const smallestHours = Math.floor(smallestTime / 60);
    const smallestMinutes = smallestTime % 60;

    return {
      hour: smallestHours,
      minute: smallestMinutes,
    };
  }

  getBiggestTime(dates: Date[]): time {
    let largestTime = 0;

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const time = hours * 60 + minutes;
      if (largestTime === 0 || time > largestTime) {
        largestTime = time;
      }
    }

    const largestHours = Math.floor(largestTime / 60);
    const largestMinutes = largestTime % 60;

    return {
      hour: largestHours,
      minute: largestMinutes,
    };
  }
}
