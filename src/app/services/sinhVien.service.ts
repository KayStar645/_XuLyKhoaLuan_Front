import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { SinhVien } from '../models/SinhVien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class sinhVienService {
    private apiUrl = environment.api;
    //private sinhViens!: BehaviorSubject<SinhVien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<SinhVien[]> {
      return this.http.get<SinhVien[]>(`${this.apiUrl}/api/Sinhviens`, this.shareService.httpOptions);
    }

    getById(maSV: string):Observable<SinhVien> {
      return this.http.get<SinhVien>(`${this.apiUrl}/api/Sinhviens/maSV?maSV=${maSV}`, this.shareService.httpOptions);
    }

    add(sinhVien: SinhVien): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Sinhviens`, sinhVien, this.shareService.httpOptions);
    }

    update(sinhVien: SinhVien): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Sinhviens/maSV?maSV=${sinhVien.maSv}`, sinhVien, this.shareService.httpOptions);
    }

    delete(maSV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Sinhviens/maSV?maSV=${maSV}`, this.shareService.httpOptions);
    }

    getByMaCn(MaCN: string):Observable<SinhVien[]> {
      return this.http.get<SinhVien[]>(`${this.apiUrl}/api/Sinhviens/maCN?maCN=${MaCN}`, this.shareService.httpOptions);
    }

    getByTenSv(tenSV: string):Observable<SinhVien[]> {
      return this.http.get<SinhVien[]>(`${this.apiUrl}/api/Sinhviens/tenSV?tenSV=${tenSV}`, this.shareService.httpOptions);
    }
}