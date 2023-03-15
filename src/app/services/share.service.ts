
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class shareService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  public dateFormat(date: string) {
      if(date != null) {
        const newDate = new Date(date);
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(newDate, 'dd/MM/yyyy');
        return formattedDate == null ? "---" : formattedDate.toString();
      }
      return date;
  }

  public getDay(date: string) {
    if(date != null) {
      const newDate = new Date(date);
      return newDate.getDate();
    }
    return date;
  }

  public getMonth(date: string) {
    if(date != null) {
      const newDate = new Date(date);
      return newDate.getMonth() + 1;
    }
    return date;
  }

  public getYear(date: string) {
    if(date != null) {
      const newDate = new Date(date);
      return newDate.getFullYear();
    }
    return date;
  }

  public compareDate(date1: string, date2: string) {
    // So sánh ngày tháng năm
    const newDate1 = new Date(date1);
    const newDate2 = new Date(date2);
    if(newDate1.getTime() > newDate2.getTime()) {
      return 1;
    } 
    if(newDate1.getTime() < newDate2.getTime()) {
      return -1;
    }
    return 0;
  }

  public ccompareTime(date1: string, date2: string) {
    // So sánh ngày tháng năm, giờ phút giây
  }

  public removeSpace(str: string) {
    // Xóa khoảng trắng đầu, cuối và thừa
    return str.replace(/\s+/g, ' ').trim();
  }
}
