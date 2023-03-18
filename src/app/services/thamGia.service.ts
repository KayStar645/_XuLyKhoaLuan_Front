import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
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
      try {
        var response = new ThamGia();
        response = await this.http.get<ThamGia>(
          `${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as ThamGia;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async getByCn(maCn: string) {
      try {
        var response: ThamGia[] = [];
        response = await this.http.get<ThamGia[]>(
          `${this.apiUrl}/api/Thamgias/maCN?maCN=${maCn}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as ThamGia[];
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
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
}
