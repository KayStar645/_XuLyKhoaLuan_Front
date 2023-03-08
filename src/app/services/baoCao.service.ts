import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { BaoCao } from '../models/BaoCao.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class baoCaoService {
    private apiUrl = environment.api;
    private BaoCaos!: BehaviorSubject<BaoCao>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<BaoCao[]> {
      return this.http.get<BaoCao[]>(`${this.apiUrl}/api/Baocaos`, this.shareService.httpOptions);
    }

    getById(MaCv: string, MaSv: string, NamHoc: string, Dot: number, LanNop: number):Observable<BaoCao> {
      return this.http.get<BaoCao>(`${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${MaCv}&MaSv=${MaSv}&NamHoc=${NamHoc}&Dot=${Dot}&LanNop=${LanNop}`, this.shareService.httpOptions);
    }

    add(BaoCao: BaoCao): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Baocaos`, BaoCao, this.shareService.httpOptions);
    }

    update(BaoCao: BaoCao): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${BaoCao.maCv}&MaSv=${BaoCao.maSv}&NamHoc=${BaoCao.namHoc}&Dot=${BaoCao.dot}&LanNop=${BaoCao.lanNop}`, BaoCao, this.shareService.httpOptions);
    }

    delete(MaCv: string, MaSv: string, NamHoc: string, Dot: number, LanNop: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Baocaos/MaCv, MaSv, NamHoc, Dot, LanNop?MaCv=${MaCv}&MaSv=${MaSv}&NamHoc=${NamHoc}&Dot=${Dot}&LanNop=${LanNop}`, this.shareService.httpOptions);
    }
}
