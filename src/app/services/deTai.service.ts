import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class deTaiService {
    private apiUrl = environment.api;
    private deTais!: BehaviorSubject<DeTai>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    //Được
    getAll(): Observable<DeTai[]> {
      return this.http.get<DeTai[]>(`${this.apiUrl}/api/Detais`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<DeTai> {
      return this.http.get<DeTai>(`${this.apiUrl}/api/Detais/maDT?maDT=${id}`, this.shareService.httpOptions);
    }

    add(deTai: DeTai): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Detais`, deTai, this.shareService.httpOptions);
    }

    //Tóm tắt không được để trống
    update(deTai: DeTai): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Detais/maDT?maDT=${deTai.maDT}`, deTai, this.shareService.httpOptions);
    }

    delete(maDT: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Detais/maDT?maDT=${maDT}`, this.shareService.httpOptions);
    }
}
