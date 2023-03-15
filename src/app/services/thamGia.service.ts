import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

    getAll(): Observable<ThamGia[]> {
      return this.http.get<ThamGia[]>(`${this.apiUrl}/api/Thamgias`, this.shareService.httpOptions);
    }

    getById(MaSV: string, NamHoc: string, Dot: number):Observable<ThamGia> {
      return this.http.get<ThamGia>(`${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, this.shareService.httpOptions);
    }

    update(ThamGia: ThamGia): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${ThamGia.maSv}&NamHoc=${ThamGia.namHoc}&Dot=${ThamGia.dot}`, ThamGia, this.shareService.httpOptions);
    }

    delete(MaSV: string, NamHoc: string, Dot: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Thamgias/MaSV, NamHoc, Dot?MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, this.shareService.httpOptions);
    }

    add(ThamGia: ThamGia): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Thamgias`, ThamGia, this.shareService.httpOptions);
    }
}
