import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DangKy } from '../models/DangKy.model';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class dangKyService {
  private apiUrl = environment.api;
  //private DangKys!: BehaviorSubject<DangKy>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<DangKy[]> {
    return (
      (await this.http
        .get<DangKy[]>(
          `${this.apiUrl}/api/Dangkys`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetAllDetaiDangky(
    namHoc: string,
    dot: number,
    maNhom: string,
    isThamkhao: boolean
  ): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/Dangkys/namHoc, dot, maNhom, isThamkhao?namHoc=${namHoc}&dot=${dot}&maNhom=${maNhom}&isThamkhao=${isThamkhao}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(maDT: string, maNhom: string): Promise<DangKy> {
    try {
      var response = new DangKy();
      response =
        (await this.http
          .get<DangKy>(
            `${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${maDT}&maNhom=${maNhom}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DangKy);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async add(DangKy: DangKy): Promise<any> {
    try {
      return await this.http
        .post(
          `${this.apiUrl}/api/Dangkys`,
          DangKy,
          this.shareService.httpOptions
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(DangKy: DangKy): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${DangKy.maDt}&maNhom=${DangKy.maNhom}`,
        DangKy,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(maDT: string, maNhom: string): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${maDT}&maNhom=${maNhom}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async isNhomDangkyDetaiAsyc(maNhom: string): Promise<Boolean> {
    return (
      (await this.http
        .get<Boolean>(
          `${this.apiUrl}/api/Dangkys/maNhom?maNhom=${maNhom}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? false
    );
  }

  async GetDetaiDangkyAsync(
    nhom: string,
    namHoc: string,
    dot: number
  ): Promise<DeTai> {
    {
      var response = new DeTai();
      return (
        (await this.http
          .get<DeTai>(
            `${this.apiUrl}/api/Dangkys/nhom, namHoc, dot?nhom=${nhom}&namHoc=${namHoc}&dot=${dot}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as DeTai)
      );
    }
  }
}
