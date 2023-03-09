import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdCham } from '../models/HdCham.model';
import { HoiDong } from '../models/HoiDong.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdChamService {
    private apiUrl = environment.api;
    private HdChams!: BehaviorSubject<HdCham>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HdCham[]> {
      return this.http.get<HdCham[]>(`${this.apiUrl}/api/Hdchams`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT: string):Observable<HdCham> {
      return this.http.get<HdCham>(`${this.apiUrl}/api/Hdchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }

    add(HdCham: HdCham): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hdchams`, HdCham, this.shareService.httpOptions);
    }

    update(HdCham: HdCham): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hdchams/MaGV, MaDT?MaGV=${HdCham.maGv}&MaDT=${HdCham.maDt}`, HdCham, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hdchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
