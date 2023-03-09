import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ThongBao } from '../models/ThongBao.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class thongBaoService {
    private apiUrl = environment.api;
    //private thongBaos!: BehaviorSubject<ThongBao>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<ThongBao[]> {
      return this.http.get<ThongBao[]>(`${this.apiUrl}/api/Thongbaos`, this.shareService.httpOptions);
    }

    getById(MaTB: number):Observable<ThongBao> {
      return this.http.get<ThongBao>(`${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${MaTB}`, this.shareService.httpOptions);
    }

    add(ThongBao: ThongBao): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Thongbaos`, ThongBao, this.shareService.httpOptions);
    }

    update(ThongBao: ThongBao): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${ThongBao.maTb}`, ThongBao, this.shareService.httpOptions);
    }

    delete(MaTB: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${MaTB}`, this.shareService.httpOptions);
    }
}
