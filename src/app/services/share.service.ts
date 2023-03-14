
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
          return date.substring(8, 10) + "/" +
                          date.substring(5, 7) + "/" +
                          date.substring(0, 4);
      }
      return date;
  }

  public getDay(date: string) {
    if(date != null) {
      return date.substring(8, 10);
    }
    return date;
  }

  public getMonth(date: string) {
    if(date != null) {
      return date.substring(5, 7);
    }
    return date;
  }

  public getYear(date: string) {
    if(date != null) {
      return date.substring(0, 4);
    }
    return date;
  }

  public compareDate(date1: string, date2: string) {
    // So sánh ngày tháng năm
  }

  public ccompareTime(date1: string, date2: string) {
    // So sánh ngày tháng năm, giờ phút giây
  }

  public removeSpace(str: string) {
    // Xóa khoảng trắng đầu, cuối và thừa
  }
}
