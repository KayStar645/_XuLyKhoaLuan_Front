import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { SinhVien } from '../models/SinhVien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class sinhVienService {
  private apiUrl = environment.api;
  //private sinhViens!: BehaviorSubject<SinhVien>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async search(maCn: string, lop: string, tenSv: string): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/maCn, lop, tenSv?maCn=${maCn}&lop=${lop}&tenSv=${tenSv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getClass(namHoc: string, dot: number): Promise<string[]> {
    return (
      (await this.http
        .get<string[]>(
          `${this.apiUrl}/api/Sinhviens/namHoc, dot?namHoc=${namHoc}&dot=${dot}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(maSV: string): Promise<SinhVien> {
    var response = new SinhVien();
    return (
      (await this.http
        .get<SinhVien>(
          `${this.apiUrl}/api/Sinhviens/maSV?maSV=${maSV}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? (response as SinhVien)
    );
  }

  async getSinhvienByDetai(maDT: string): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/maDT?maDT=${maDT}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async add(sinhVien: SinhVien): Promise<any> {
    return await this.http
      .post(
        `${this.apiUrl}/api/Sinhviens`,
        sinhVien,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async update(sinhVien: SinhVien): Promise<any> {
    return this.http
      .put<any>(
        `${this.apiUrl}/api/Sinhviens/maSV?maSV=${sinhVien.maSv}`,
        sinhVien,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(maSV: string): Promise<any> {
    return this.http
      .delete(
        `${this.apiUrl}/api/Sinhviens/maSV?maSV=${maSV}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async getByMaCn(maCN: string): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/maCN?maCN=${maCN}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getByMaKhoa(maKhoa: string): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/maKhoa?maKhoa=${maKhoa}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getByTenSv(tenSV: string): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/tenSV?tenSV=${tenSV}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getByDotDk(
    namHoc: string,
    dot: number,
    flag: boolean
  ): Promise<SinhVien[]> {
    return (
      (await this.http
        .get<SinhVien[]>(
          `${this.apiUrl}/api/Sinhviens/namHoc, dot, flag?namHoc=${namHoc}&dot=${dot}&flag=${flag}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async isHaveThisStudent(maSV: string): Promise<boolean> {
    return (await this.getAll()).filter((sv) => sv.maSv === maSV).length > 0
      ? true
      : false;
  }
}