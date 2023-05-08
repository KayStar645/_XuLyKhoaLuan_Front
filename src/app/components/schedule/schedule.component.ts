import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  compareAsc,
  isWithinInterval,
  max,
  min,
  add,
  subDays,
  addDays,
} from 'date-fns';
import { DatePickerComponent } from 'ng2-date-picker';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';

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
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  @ViewChild('dayPicker')
  datePicker!: DatePickerComponent;

  @Input() data: LichPhanBien[] = [];

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

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setSchedule();
  }

  ngAfterViewInit(): void {
    // this.removeRightCell();
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
          table.rows[i].deleteCell(7);
          count++;
        } else {
          break;
        }
      }
    });
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
