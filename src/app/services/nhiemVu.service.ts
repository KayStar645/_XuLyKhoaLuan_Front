import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { NhiemVu } from '../models/NhiemVu.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class nhiemVuService {
    private apiUrl = environment.api;
    //private nhiemVus!: BehaviorSubject<NhiemVu>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<NhiemVu[]> {
      return this.http.get<NhiemVu[]>(`${this.apiUrl}/api/Nhiemvus`, this.shareService.httpOptions);
    }

    getById(MaNV: number):Observable<NhiemVu> {
      return this.http.get<NhiemVu>(`${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${MaNV}`, this.shareService.httpOptions);
    }

    add(nhiemVu: NhiemVu): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Nhiemvus`, nhiemVu, this.shareService.httpOptions);
    }

    update(nhiemVu: NhiemVu): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${nhiemVu.maNv}`, nhiemVu, this.shareService.httpOptions);
    }

    delete(MaNV: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${MaNV}`, this.shareService.httpOptions);
    }
}
