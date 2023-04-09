import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class deTaiService {
  private apiUrl = environment.api;
  //private deTais!: BehaviorSubject<DeTai>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(id: string): Promise<DeTai> {
    try {
      var response = new DeTai();
      response =
        (await this.http
          .get<DeTai>(
            `${this.apiUrl}/api/Detais/maDT?maDT=${id}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DeTai);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getByChuyenNganh(maCN: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/MaCN?MaCN=${maCN}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getChuyennganhOfDetai(maDT: string) {
    try {
      var response: DeTai[] = [];
      response =
        (await this.http
          .get<DeTai[]>(
            `${this.apiUrl}/api/Detais/MaDeTai?MaDeTai=${maDT}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DeTai[]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async GetDeTaisByChuyennganhGiangvien(maCn: string, maGv: string) {
    try {
      var response: DeTai[] = [];
      response =
        (await this.http
          .get<DeTai[]>(
            `${this.apiUrl}/api/Detais/maCn, maGv?maCn=${maCn}&maGv=${maGv}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DeTai[]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async searchByName(tenGV: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/tenDT?tenDT=${tenGV}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async add(deTai: DeTai): Promise<any> {
    return await this.http
      .post(`${this.apiUrl}/api/Detais`, deTai, this.shareService.httpOptions)
      .toPromise();
  }

  // async createMaDT(maKhoa: string): Promise<string> {
  //   return (
  //     (await this.http
  //       .get<string>(
  //         `${this.apiUrl}/api/Detais/maK?maK=${maKhoa}`,
  //         this.shareService.httpOptions
  //       )
  //       .toPromise()) ?? ''
  //   );
  // }

  //Tóm tắt không được để trống
  async update(deTai: DeTai): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Detais/maDT?maDT=${deTai.maDT}`,
        deTai,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(maDT: string): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Detais/maDT?maDT=${maDT}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async GetAllDeTaisByMakhoa(maKhoa: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maKhoa?maKhoa=${maKhoa}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetAllDeTaisByMaBomon(maBm: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maBm?maBm=${maBm}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetAllDeTaisByGiangvien(maGv: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maGv?maGv=${maGv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async CheckisDetaiOfGiangvien(maDt: string, maGv: string): Promise<boolean> {
    return (
      (await this.http
        .get<boolean>(
          `${this.apiUrl}/api/Detais/maDt, maGv?maDt=${maDt}&maGv=${maGv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? false
    );
  }

  async isHaveDeTaiInNamHocDotActive(
    namHoc: string,
    dot: number
  ): Promise<boolean> {
    return (await this.getAll()).filter(
      (dt) => dt.namHoc == namHoc && dt.dot == dot && dt.trangThai == true
    ).length > 0
      ? true
      : false;
  }
}
