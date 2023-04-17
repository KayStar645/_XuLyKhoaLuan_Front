import { Component, Input, OnInit } from '@angular/core';
import { endOfDay, startOfDay } from 'date-fns';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  @Input() data: any[] = [];

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
