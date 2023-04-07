import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ThamGia } from '../models/ThamGia.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class thamGiaService {
    private apiUrl = environment.api;
    //private thamGias!: BehaviorSubject<ThamGia>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<ThamGia[]> {
      return await this.http.get<ThamGia[]>(`${this.apiUrl}/api/Thamgias`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaSV: string, NamHoc: string, Dot: number):Promise<ThamGia> {
      var response = new ThamGia();
        return await this.http.get<ThamGia>(
          `${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as ThamGia;
    }

    async getByCn(maCn: string) {
      return await this.http.get<ThamGia[]>(
        `${this.apiUrl}/api/Thamgias/maCN?maCN=${maCn}`,
        this.shareService.httpOptions
      ).toPromise() ?? [];
    }

    async searchThamgiaByName(name: string): Promise<ThamGia[]> {
      return await this.http.get<ThamGia[]>(`${this.apiUrl}/api/Thamgias/name?name=${name}`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async update(ThamGia: ThamGia): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${ThamGia.maSv}&NamHoc=${ThamGia.namHoc}&Dot=${ThamGia.dot}`, 
      ThamGia, this.shareService.httpOptions).toPromise();
    }

    async delete(MaSV: string, NamHoc: string, Dot: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, 
      this.shareService.httpOptions).toPromise();
    }

    async add(ThamGia: ThamGia): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Thamgias`, 
      ThamGia, this.shareService.httpOptions).toPromise();
    }

    async isJoinedAGroup(MaSV: string, NamHoc: string, Dot: number):Promise<boolean> {
      return (await this.getAll())
        .filter(tg => tg.maSv == MaSV && tg.namHoc == NamHoc && tg.dot == Dot).length > 0 ? true : false;
    }

    async isNotJoinedAGroupThisSemester(MaSV: string, NamHoc: string, Dot: number):Promise<boolean> {
      return (await this.getAll())
        .filter(tg => tg.maSv == MaSV && tg.namHoc == NamHoc && tg.dot == Dot 
          && (tg.maNhom === null || tg.maNhom === '')).length > 0 ? true : false;
    }
}
