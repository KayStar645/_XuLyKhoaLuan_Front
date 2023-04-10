import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';
import { SinhVien } from '../models/SinhVien.model';

@Injectable({
  providedIn: 'root',
})
export class deTaiService {
  private apiUrl = environment.api;
  //private deTais!: BehaviorSubject<DeTai>;

  constructor(private http: HttpClient, private shareService: shareService) {}

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

  async getDetaiByDot(namHoc: string, dot: number): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/namHoc, dot?namHoc=${namHoc}&dot=${dot}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getDetaiByBomonDot(
    maBM: string,
    namHoc: string,
    dot: number,
    flag: boolean
  ): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maBM, namHoc, dot, flag?maBM=${maBM}&namHoc=${namHoc}&dot=${dot}&flag=${flag}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetDetaiByChuyenNganhBomon(maCN: string, maBM: string): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maCN, maBM?maCN=${maCN}&maBM=${maBM}`,
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

  async getDetaiByName(tenDT: string): Promise<DeTai> {
    try {
      var response = new DeTai();
      response =
        (await this.http
          .get<DeTai>(
            `${this.apiUrl}/api/Detais/nameDT?nameDT=${tenDT}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DeTai);
      return response;
    } catch (error) {
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

  async GetAllDeTaisByMaBomon(maBm: string, flag: boolean): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maBm, flag?maBm=${maBm}&flag=${flag}`,
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

  async GetDetaiByHuongdanOfGiangvienDotdk(
    maGVHD: string,
    namHoc: string,
    dot: number
  ): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maGVHD, namHoc, dot?maGVHD=${maGVHD}&namHoc=${namHoc}&dot=${dot}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetDetaiByPhanbienOfGiangvienDotdk(
    maGVPB: string,
    namHoc: string,
    dot: number
  ): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Detais/maGVPB, namHoc, dot?maGVPB=${maGVPB}&namHoc=${namHoc}&dot=${dot}`,
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
      (dt) => dt.namHoc == namHoc && dt.dot == dot && dt.trangThai == false
    ).length > 0
      ? true
      : false;
  }
}
