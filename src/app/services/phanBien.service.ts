import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PhanBien } from '../models/PhanBien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class phanBienService {
    private apiUrl = environment.api;
    private phanBiens!: BehaviorSubject<PhanBien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<PhanBien[]> {
      return this.http.get<PhanBien[]>(`${this.apiUrl}/api/Phanbiens`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT:string):Observable<PhanBien> {
      return this.http.get<PhanBien>(`${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }

    add(phanBien: PhanBien): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Phanbiens`, phanBien, this.shareService.httpOptions);
    }

    update(phanBien: PhanBien): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${phanBien.maGv}&MaDT=${phanBien.maDt}`, phanBien, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT:string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
