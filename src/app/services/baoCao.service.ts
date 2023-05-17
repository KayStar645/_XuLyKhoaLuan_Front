import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { BaoCao } from '../models/BaoCao.model';
import { shareService } from './share.service';
import { BaoCaoVT } from '../models/VirtualModel/BaoCaoVTModel';

@Injectable({
  providedIn: 'root',
})
export class baoCaoService {
  private apiUrl = environment.api;
  //private BaoCaos!: BehaviorSubject<BaoCao>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<BaoCao[]> {
    return (
      (await this.http
        .get<BaoCao[]>(
          `${this.apiUrl}/api/Baocaos`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(
    MaCv: string,
    MaSv: string,
    NamHoc: string,
    Dot: number,
    LanNop: number
  ): Promise<BaoCao> {
    var response = new BaoCao();
    response =
      (await this.http
        .get<BaoCao>(
          `${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${MaCv}&MaSv=${MaSv}&NamHoc=${NamHoc}&Dot=${Dot}&LanNop=${LanNop}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? (response as BaoCao);
    return response;
  }

  async add(BaoCao: BaoCao): Promise<any> {
    return await this.http
      .post(`${this.apiUrl}/api/Baocaos`, BaoCao, this.shareService.httpOptions)
      .toPromise();
  }

  async update(BaoCao: BaoCao): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${BaoCao.maCv}&MaSv=${BaoCao.maSv}&NamHoc=${BaoCao.namHoc}&Dot=${BaoCao.dot}&LanNop=${BaoCao.lanNop}`,
        BaoCao,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(
    MaCv: string,
    MaSv: string,
    NamHoc: string,
    Dot: number,
    LanNop: number
  ): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${MaCv}&MaSv=${MaSv}&NamHoc=${NamHoc}&Dot=${Dot}&LanNop=${LanNop}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async GetBaocaoByMacv(maCv: string, maSv: string): Promise<BaoCaoVT[]> {
    return (
      (await this.http
        .get<BaoCaoVT[]>(
          `${this.apiUrl}/api/Baocaos/maCv,maSv?maCv=${maCv}&maSv=${maSv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }
}
