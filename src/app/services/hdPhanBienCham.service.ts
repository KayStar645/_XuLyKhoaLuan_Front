import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdPhanBienCham } from '../models/HdPhanBienCham.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdPhanBienChamService {
    private apiUrl = environment.api;
    //private HdPhanBienChams!: BehaviorSubject<HdPhanBienCham>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HdPhanBienCham[]> {
      return this.http.get<HdPhanBienCham[]>(`${this.apiUrl}/api/Hdpbchams`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaHD: string, MaDT: string, MaSV: string, NamHoc: string, Dot: number):Observable<HdPhanBienCham> {
      return this.http.get<HdPhanBienCham>(`${this.apiUrl}/api/Hdpbchams/MaGV, MaHD, MaDT, MaSV, NamHoc, Dot?MaGV=${MaGV}&MaHD=${MaHD}&MaDT=${MaDT}&MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, this.shareService.httpOptions);
    }

    add(HdPhanBienCham: HdPhanBienCham): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hdpbchams`, HdPhanBienCham, this.shareService.httpOptions);
    }

    update(HdPhanBienCham: HdPhanBienCham): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hdpbchams/MaGV, MaHD, MaDT, MaSV, NamHoc, Dot?MaGV=${HdPhanBienCham.maGv}&MaHD=${HdPhanBienCham.maHd}&MaDT=${HdPhanBienCham.maDt}&MaSV=${HdPhanBienCham.maSv}&NamHoc=${HdPhanBienCham.namHoc}&Dot=${HdPhanBienCham.dot}`, HdPhanBienCham, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaHD: string, MaDT: string, MaSV: string, NamHoc: string, Dot: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hdpbchams/MaGV, MaHD, MaDT, MaSV, NamHoc, Dot?MaGV=${MaGV}&MaHD=${MaHD}&MaDT=${MaDT}&MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, this.shareService.httpOptions);
    }
}
