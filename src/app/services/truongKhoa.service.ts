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

    async getByMaKhoaMaGV(MaKhoa: string, MaGV: string):Promise<TruongKhoa> {
      var response = new TruongKhoa();
      return await this.http.get<TruongKhoa>(
        `${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${MaKhoa}&MaGV=${MaGV}`,
      this.shareService.httpOptions).toPromise()?? response as TruongKhoa;
    }

    async getByMaGV(MaGV: string):Promise<TruongKhoa> {
      var response = new TruongKhoa();
      return await this.http.get<TruongKhoa>(
        `${this.apiUrl}/api/Truongkhoas/MaGV?MaGV=${MaGV}`,
      this.shareService.httpOptions).toPromise()?? response as TruongKhoa;
    }

    async add(TruongKhoa: TruongKhoa): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Truongkhoas`, 
      TruongKhoa, this.shareService.httpOptions).toPromise();
    }

    async update(TruongKhoa: TruongKhoa): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${TruongKhoa.maKhoa}&MaGV=${TruongKhoa.maGv}`, 
      TruongKhoa, this.shareService.httpOptions).toPromise();
    }

    async delete(MaKhoa: string, MaGV: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${MaKhoa}&MaGV=${MaGV}`, 
      this.shareService.httpOptions).toPromise();
    }
}
