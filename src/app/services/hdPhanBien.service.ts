import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdPhanBien } from '../models/HdPhanBien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdPhanBienService {
    private apiUrl = environment.api;
    //private HdPhanBiens!: BehaviorSubject<HdPhanBien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HdPhanBien[]> {
      return this.http.get<HdPhanBien[]>(`${this.apiUrl}/api/Hdphanbiens`, this.shareService.httpOptions);
    }

    add(HdPhanBien: HdPhanBien): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hdphanbiens`, HdPhanBien, this.shareService.httpOptions);
    }

    update(HdPhanBien: HdPhanBien): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hdphanbiens/MaGV, MaHD, MaDT?MaGV=${HdPhanBien.maGv}&MaHD=${HdPhanBien.maHd}&MaDT=${HdPhanBien.maDt}`, HdPhanBien, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaHD: string, MaDT:string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hdphanbiens/MaGV, MaHD, MaDT?MaGV=${MaGV}&MaHD=${MaHD}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
