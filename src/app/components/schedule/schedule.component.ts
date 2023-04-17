import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { endOfDay, format, startOfDay } from 'date-fns';
import { DatePickerComponent } from 'ng2-date-picker';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @ViewChild('dayPicker')
  datePicker!: DatePickerComponent;

  @Input() data: any[] = [];

  currDate: string = format(new Date(), 'dd-MM-yyyy');

  ngOnInit(): void {
    this.setSchedule();

  }

  setSchedule() {
    // let endOfDayHour: number = endOfDay(new Date()).getHours();

    for (let i = 7; i <= 21; i++) {
      let x = i - 7;
      if (this.data[x]) {
        if (i < 12) {
          if (i > 9) {
            this.data[x].thoiGian = `${i}:00`;
          } else {
            this.data[x].thoiGian = `0${i}:00`;
          }
        } else {
          this.data[x].thoiGian = `${i}:00`;
        }
      } else {
        if (i < 12) {
          if (i > 9) {
            this.data.push({
              thoiGian: `${i}:00`,
            });
          } else {
            this.data.push({
              thoiGian: `0${i}:00`,
            });
          }
        } else {
          this.data.push({
            thoiGian: `${i}:00`,
          });
        }
      }
    }
  }
}
