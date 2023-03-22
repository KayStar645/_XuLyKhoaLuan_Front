import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TruongKhoa } from '../models/TruongKhoa.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class truongKhoaService {
    private apiUrl = environment.api;
    //private TruongKhoas!: BehaviorSubject<TruongKhoa>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<TruongKhoa[]> {
      return await this.http.get<TruongKhoa[]>(`${this.apiUrl}/api/Truongkhoas`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(maTk: number):Promise<TruongKhoa> {
      var response = new TruongKhoa();
      return await this.http.get<TruongKhoa>(
        `${this.apiUrl}/api/Truongkhoas/maTk?maTk=${maTk}`,
      this.shareService.httpOptions).toPromise()?? response;
    }

    async CheckTruongKhoaByMaGV(MaGV: string):Promise<TruongKhoa> {
      try {
        var response = new TruongKhoa();
      return await this.http.get<TruongKhoa>(
        `${this.apiUrl}/api/Truongkhoas/maGV?maGV=${MaGV}`,
      this.shareService.httpOptions).toPromise() ?? response;
      } catch (error) {
        throw error;
      }
    }

    async add(TruongKhoa: TruongKhoa): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Truongkhoas`, 
      TruongKhoa, this.shareService.httpOptions).toPromise();
    }

    async update(TruongKhoa: TruongKhoa): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Truongkhoas/maTK?maTK=${TruongKhoa.maTk}`, 
      TruongKhoa, this.shareService.httpOptions).toPromise();
    }

    async delete(maTk: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Truongkhoas/maTK?maTK=${maTk}`, 
      this.shareService.httpOptions).toPromise();
    }
}
