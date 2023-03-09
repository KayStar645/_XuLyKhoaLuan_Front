import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DuyetDt } from '../models/DuyetDt.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class duyetDtService {
    private apiUrl = environment.api;
    //private duyetDts!: BehaviorSubject<DuyetDt>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<DuyetDt[]> {
      return this.http.get<DuyetDt[]>(`${this.apiUrl}/api/Duyetdts`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT: string, LanDuyet:number):Observable<DuyetDt> {
      return this.http.get<DuyetDt>(`${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${MaGV}&MaDT=${MaDT}&LanDuyet=${LanDuyet}`, this.shareService.httpOptions);
    }

    //Ngày duyệt phải theo chuẩn ngày tháng năm
    add(duyetDt: DuyetDt): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Duyetdts`, duyetDt, this.shareService.httpOptions);
    }

    update(duyetDt: DuyetDt): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${duyetDt.maGv}&MaDT=${duyetDt.maDt}&LanDuyet=${duyetDt.lanDuyet}`, duyetDt, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT: string, LanDuyet:number):Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${MaGV}&MaDT=${MaDT}&LanDuyet=${LanDuyet}`, this.shareService.httpOptions);
    }
}
