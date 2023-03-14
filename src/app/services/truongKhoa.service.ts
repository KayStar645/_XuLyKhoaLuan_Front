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

    getAll(): Observable<TruongKhoa[]> {
      return this.http.get<TruongKhoa[]>(`${this.apiUrl}/api/Truongkhoas`, this.shareService.httpOptions);
    }

    getByMaKhoaMaGV(MaKhoa: string, MaGV: string):Observable<TruongKhoa> {
      return this.http.get<TruongKhoa>(`${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${MaKhoa}&MaGV=${MaGV}`, this.shareService.httpOptions);
    }

    getByMaGV(MaGV: string):Observable<TruongKhoa> {
      return this.http.get<TruongKhoa>(`${this.apiUrl}/api/Truongkhoas/MaGV?MaGV=${MaGV}`, this.shareService.httpOptions);
    }

    add(TruongKhoa: TruongKhoa): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Truongkhoas`, TruongKhoa, this.shareService.httpOptions);
    }

    update(TruongKhoa: TruongKhoa): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${TruongKhoa.maKhoa}&MaGV=${TruongKhoa.maGv}`, TruongKhoa, this.shareService.httpOptions);
    }

    delete(MaKhoa: string, MaGV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Truongkhoas/MaKhoa, MaGV?MaKhoa=${MaKhoa}&MaGV=${MaGV}`, this.shareService.httpOptions);
    }
}
