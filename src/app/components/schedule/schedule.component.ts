import { GapMatHdService } from './../../services/gapMatHd.service';
import { WebsocketService } from './../../services/Websocket.service';
import { phanBienService } from 'src/app/services/phanBien.service';
import { huongDanService } from 'src/app/services/huongDan.service';
import { lichPhanBienService } from '../../services/NghiepVu/lichphanbien.service';
import {
   Component,
   Input,
   OnInit,
   ViewChild,
   OnChanges,
   AfterViewInit,
   AfterContentInit,
} from '@angular/core';
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
   isFuture,
} from 'date-fns';
import { DatePickerComponent } from 'ng2-date-picker';
import { ToastrService } from 'ngx-toastr';
import { HomeMainComponent } from 'src/app/home/home-main/home-main.component';
import { DeTai } from 'src/app/models/DeTai.model';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { PhanBien } from 'src/app/models/PhanBien.model';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { Form, dateVNConvert } from 'src/assets/utils';
import { shareService } from 'src/app/services/share.service';
import { GapMatHd } from 'src/app/models/GapMatHd.model';

type date = {
   start: Date;
   end: Date;
};

type schedule = {
   hour: number;
   time?: string;
   rowSpan?: number;
   day?: number;
   name?: string;
   place?: string;
   index?: number;
   status?: 'past' | 'today' | 'future';
   type?: 'Hàng tuần' | 'Hướng dẫn' | 'Phản biện' | 'Hội đồng';
   offsetX?: string;
   offsetY?: string;
   width?: string;
   height?: string;
   detail?: LichPhanBien;
};

@Component({
   selector: 'app-schedule',
   templateUrl: './schedule.component.html',
   styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
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
   lichs: LichPhanBien[] = [];
   schedules: schedule[] = [];

   startOfWeek!: Date;
   endOfWeek!: Date;

   dateOfWeek: Date[] = [];
   dateInWeek: date[] = [];

   maxHour!: number;
   minHour!: number;

   times: number[] = [];

   lich: Form = new Form({
      ngayHienTai: [''],
      ngayBD: [''],
      TGBatDau: [''],
      TGKetThuc: [''],
      diaDiem: [''],
   });
   form = this.lich.form;
   loaiLich: any[] = [];
   deTais: DeTai[] = [];
   deTai: DeTai[] = [];

   constructor(
      private huongDanService: huongDanService,
      private phanBienService: phanBienService,
      private toastService: ToastrService,
      private lichPhanBienService: lichPhanBienService,
      private websocketService: WebsocketService,
      private GapMatHdService: GapMatHdService
   ) {}

   ngAfterContentInit(): void {}

   ngAfterViewInit(): void {}

   ngOnInit(): void {
      this.deTais = [];

      window.addEventListener('click', (e) => {
         let target = e.target as HTMLElement;
         let element = target.closest('.calendar-item');

         if (!element) {
            document.querySelector('.calendar-item.active')?.classList.remove('active');
         }
      });

      this.websocketService.startConnection();
   }

   ngOnChanges(): void {
      this.setSchedule();
   }

   setSchedule() {
      this.getWeek();
      this.getDate();
      this.getDateInWeekFromData();
      this.getHours();

      setTimeout(() => {
         this.getSchedule();
      }, 1);
   }

   async onSelectType(event: any) {
      // Thay đổi loại lịch khi thêm nè
      this.deTais = await this.lichPhanBienService.GetSelectDetaiByGiangVien(
         this.maGv,
         shareService.namHoc,
         shareService.dot,
         event.id == '0' ? '1' : event.id 
      );
   }

   onSelectDate($event: any) {
      let formValue: any = this.lich.form.value;

      this.rootDate = new Date(dateVNConvert(formValue.ngayHienTai));
      this.setSchedule();
   }

   onClickPrev() {
      this.rootDate = subDays(this.rootDate, 7);

      this.setSchedule();
   }

   onClickCurrent() {
      this.rootDate = this.currDate;

      this.setSchedule();
   }

   onShowDropDown(event: Event) {
      let target = event.target as HTMLElement;
      let element: HTMLDivElement = target.closest('.calendar-item')!;

      let check =
         element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

      document.querySelector('.calendar-item.active')?.classList.remove('active');

      if (check) {
         element.classList.add('active');
      } else {
         element.classList.remove('active');
      }
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
      this.lichs = [];

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
            this.lichs.push(lich);
         }
      });
   }

   getHours() {
      let dateStart = this.dateInWeek.map((t) => t.start);
      let dateEnd = this.dateInWeek.map((t) => t.end);

      this.minHour = this.getSmallestTime(dateStart);
      this.maxHour = this.getBiggestTime(dateEnd);

      this.times = [];

      for (let i = this.minHour; i <= this.maxHour; i++) {
         this.times.push(i);
      }
   }

   getSchedule() {
      this.schedules = [];
      let day = document.querySelector('.day-in-week') as HTMLDivElement;

      this.lichs.forEach((lich) => {
         let start = new Date(lich.thoiGianBD);
         let end = new Date(lich.thoiGianKT);
         let hour = start.getHours();
         let height = (end.getHours() - start.getHours()) * 70;
         let heightBonus = height > 0 ? 0 : 20;
         let time = format(start, 'HH:mm').concat(' - ').concat(format(end, 'HH:mm'));

         this.schedules.push({
            time,
            hour,
            offsetY: this.getOffsetY(start),
            offsetX: this.getOffsetX(start),
            name: lich.tenDeTai,
            type: this.getScheduleType(lich.loaiLich),
            status: this.getScheduleStatus(start),
            place: lich.diaDiem,
            width: day.getBoundingClientRect().width - 8 + 'px',
            height: end.getMinutes() + heightBonus + height + 'px',
            detail: lich,
         });
      });
   }

   getOffsetY(date: Date): string {
      let daysElement = document.querySelector('.days') as HTMLDivElement;
      let offsetYBonus = daysElement.getBoundingClientRect().bottom + 4;
      let hour = (date.getHours() - this.minHour) * 80;
      let bonus = hour > 0 ? 6 : 0;

      return offsetYBonus + date.getMinutes() + bonus + hour + 'px';
   }

   getOffsetX(date: Date): string {
      let days: HTMLDivElement[] = Array.from(document.querySelectorAll('.day'));
      let day = date.getDay().toString();

      return days.find((t) => t.dataset.day === day)!.getBoundingClientRect().left + 4 + 'px';
   }

   getSmallestTime(dates: Date[]) {
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

      return smallestHours;
   }

   getBiggestTime(dates: Date[]) {
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

      const biggestHours = Math.floor(largestTime / 60);

      return biggestHours;
   }

   getScheduleType(type: Number): 'Hàng tuần' | 'Hướng dẫn' | 'Phản biện' | 'Hội đồng' | undefined {
      if (type === 0) {
         return 'Hàng tuần';
      }
      if (type === 1) {
         return 'Hướng dẫn';
      }
      if (type === 2) {
         return 'Phản biện';
      }
      if (type === 3) {
         return 'Hội đồng';
      }

      return undefined;
   }

   onShowFormUpdate(lich: LichPhanBien | undefined) {
      try {
         let update = document.querySelector('#update');
         let update_box = document.querySelector('#update_box');

         update?.classList.add('active');
         update_box?.classList.add('active');
      } catch (error) {}
   }

   handleToggleUpdate() {
      let update = document.querySelector('#update');
      let update_box = document.querySelector('#update_box');

      update?.classList.remove('active');
      update_box?.classList.remove('active');
   }

   getScheduleStatus(date: Date): 'past' | 'today' | 'future' | undefined {
      if (isToday(date)) {
         return 'today';
      }
      if (isPast(date)) {
         return 'past';
      }
      if (isFuture(date)) {
         return 'future';
      }

      return undefined;
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
         let flag = -1;

         switch (this.loaiLich[0].id) {
            case 0: {
               let lich = new GapMatHd();

               lich.id = 0;
               lich.diaDiem = formValue.diaDiem;
               lich.maDt = this.deTai[0].maDT;
               lich.maGv = HomeMainComponent.maGV;
               lich.thoiGianBd = ngayLap + 'T' + formValue.TGBatDau + '.000Z';
               lich.thoiGianKt = ngayLap + 'T' + formValue.TGKetThuc + '.000Z';

               if (lich.diaDiem == '') {
                  this.toastService.warning('Vui lòng nhập địa điểm!', 'Thông báo !');
                  return;
               }

               flag = await this.huongDanService.CheckThoiGianUpdateLich(
                  lich.maGv,
                  lich.thoiGianBd,
                  lich.thoiGianKt
               );
               if (flag == -1) {
                  this.toastService.error('Thời gian bị trùng! Thêm lịch thất bại!', 'Thông báo !');
                  return;
               } else if (flag == 0) {
                  this.toastService.error(
                     'Thời gian bắt đầu phải trước thời gian kết thúc!',
                     'Thông báo !'
                  );
                  return;
               }

               await this.GapMatHdService.update(lich);
               this.websocketService.sendForGapMatHd(true);
               break;
            }
            case 1: {
               let lich = new HuongDan();

               lich.diaDiem = formValue.diaDiem;
               lich.duaRaHd = false;
               lich.maDt = this.deTai[0].maDT;
               lich.maGv = HomeMainComponent.maGV;
               lich.thoiGianBD = ngayLap + 'T' + formValue.TGBatDau + '.000Z';
               lich.thoiGianKT = ngayLap + 'T' + formValue.TGKetThuc + '.000Z';

               if (lich.diaDiem == '') {
                  this.toastService.warning('Vui lòng nhập địa điểm!', 'Thông báo !');
                  return;
               }

               flag = await this.huongDanService.CheckThoiGianUpdateLich(
                  lich.maGv,
                  lich.thoiGianBD,
                  lich.thoiGianKT
               );
               if (flag == -1) {
                  this.toastService.error('Thời gian bị trùng! Thêm lịch thất bại!', 'Thông báo !');
                  return;
               } else if (flag == 0) {
                  this.toastService.error(
                     'Thời gian bắt đầu phải trước thời gian kết thúc!',
                     'Thông báo !'
                  );
                  return;
               }

               await this.huongDanService.update(lich);
               this.websocketService.sendForHuongDan(true);
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

               flag = await this.huongDanService.CheckThoiGianUpdateLich(
                  lich.maGv,
                  lich.thoiGianBD,
                  lich.thoiGianKT
               );
               if (flag == -1) {
                  this.toastService.error('Thời gian bị trùng! Thêm lịch thất bại!', 'Thông báo !');
                  return;
               } else if (flag == 0) {
                  this.toastService.error(
                     'Thời gian bắt đầu phải trước thời gian kết thúc!',
                     'Thông báo !'
                  );
                  return;
               }

               await this.phanBienService.update(lich);
               this.websocketService.sendForPhanBien(true);
               break;
            }
            case 3: {
               // Không có thêm lịch hội đồng ở đâu (lập hội đồng tự có)

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
}
