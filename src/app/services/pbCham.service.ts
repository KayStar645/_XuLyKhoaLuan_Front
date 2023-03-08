import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PbCham } from '../models/PbCham.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class pbChamService {
    private apiUrl = environment.api;
    private PbChams!: BehaviorSubject<PbCham>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<PbCham[]> {
      return this.http.get<PbCham[]>(`${this.apiUrl}/api/Pbchams`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT: string):Observable<PbCham> {
      return this.http.get<PbCham>(`${this.apiUrl}/api/Pbchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }

    add(PbCham: PbCham): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Pbchams`, PbCham, this.shareService.httpOptions);
    }

    update(PbCham: PbCham): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Pbchams/MaGV, MaDT?MaGV=${PbCham.maGv}&MaDT=${PbCham.maDt}`, PbCham, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Pbchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
