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
    let endOfDayHour: number = endOfDay(new Date()).getHours();

    for (let i = 0; i <= endOfDayHour; i++) {
      if (this.data[i]) {
        if (i < 12) {
          if (i > 9) {
            this.data[i].thoiGian = `${i}:00 AM`;
          } else {
            this.data[i].thoiGian = `0${i}:00 AM`;
          }
        } else {
          this.data[i].thoiGian = `${i}:00 PM`;
        }
      } else {
        if (i < 12) {
          if (i > 9) {
            this.data.push({
              thoiGian: `${i}:00 AM`,
            });
          } else {
            this.data.push({
              thoiGian: `0${i}:00 AM`,
            });
          }
        } else {
          this.data.push({
            thoiGian: `${i}:00 PM`,
          });
        }
      }
    }
  }
}
