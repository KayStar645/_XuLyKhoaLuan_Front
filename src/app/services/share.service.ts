import { dotDkService } from './dotDk.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class shareService {
  static namHoc:string;
  static dot: number;
  isFirstClickHome = false;

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private dotDkService: dotDkService
    ) {}

  public dateFormat(date: string) {
    if (date != null) {
      const newDate = new Date(date);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(newDate, 'dd/MM/yyyy');
      return formattedDate == null ? '---' : formattedDate.toString();
    }
    return date;
  }

  public async uploadFile(
    file: any,
    apiUrl: string = environment.githubNotifyFilesAPI
  ): Promise<any> {
    const fileReader = new FileReader();
    const url = apiUrl + file.name;

    try {
      await this.http.get(url).toPromise();
    } catch (err) {
      fileReader.onload = async () => {
        const fileDataUrl = fileReader.result as string;
        const fileContent = fileDataUrl.split(',')[1];

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${environment.githubToken}`,
          }),
        };
        const body = {
          message: `Add ${file.name}`,
          content: fileContent,
          branch: 'main',
        };

        try {
          await this.http.put(url, body, httpOptions).toPromise();
        } catch (error) {
          console.error(error);
        }
      };
      fileReader.readAsDataURL(file);
    }
  }

  public getDay(date: string) {
    if (date != null) {
      const newDate = new Date(date);
      return newDate.getDate();
    }
    return date;
  }

  public getMonth(date: string) {
    if (date != null) {
      const newDate = new Date(date);
      return newDate.getMonth() + 1;
    }
    return date;
  }

  public getYear(date: string) {
    if (date != null) {
      const newDate = new Date(date);
      return newDate.getFullYear();
    }
    return date;
  }

  public compareDate(date1: string, date2: string) {
    // So sánh ngày tháng năm
    const newDate1 = new Date(date1);
    const newDate2 = new Date(date2);
    if (newDate1.getTime() > newDate2.getTime()) {
      return 1;
    }
    if (newDate1.getTime() < newDate2.getTime()) {
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

  customValidator(
    nameError: string,
    regex: RegExp,
    logicResult: boolean = false
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = regex.test(control.value)
        ? null
        : { [nameError]: { value: control.value } };

      if (logicResult) {
        isValid = null;
      }

      return isValid;
    };
  }

  // setNamHoc(namHoc: string){
  //   this.namHoc = namHoc;
  // }

  // getNamHoc(){
  //   return this.namHoc;
  // }

  // setDot(dot: number){
  //   this.dot = dot;
  // }

  // getDot(){
  //   return this.dot;
  // }

  setIsFirstClickHome(value: boolean){
    this.isFirstClickHome = value;
  }

  getIsFirstClickHome(){
    return this.isFirstClickHome;
  }

  async namHocDotDk() {
    const latestYear = (await this.dotDkService.getAll()).sort((a, b) => {
      if (a.namHoc !== b.namHoc) {
        return b.namHoc.localeCompare(a.namHoc);
      } else {
        return b.dot - a.dot;
      }
    })[0];
    shareService.namHoc = latestYear.namHoc;
    shareService.dot = latestYear.dot;
  }
}
