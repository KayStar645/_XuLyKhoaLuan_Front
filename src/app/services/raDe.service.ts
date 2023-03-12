import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PhanBien } from '../models/PhanBien.model';
import { RaDe } from '../models/RaDe.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class raDeService {
    private apiUrl = environment.api;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<RaDe[]> {
      return this.http.get<RaDe[]>(`${this.apiUrl}/api/Rade`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT:string):Observable<RaDe> {
      return this.http.get<RaDe>(`${this.apiUrl}/api/Rade/maGV, maDT?maGV=${MaGV}&maDT=${MaDT}`, this.shareService.httpOptions);
    }

    add(raDe: RaDe): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Rade`, raDe, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT:string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Rade/MaGV, maDT?maGV=${MaGV}&maDT=${MaDT}`, this.shareService.httpOptions);
    }
}