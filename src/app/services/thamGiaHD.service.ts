import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ThamGiaHd } from '../models/ThamGiaHd.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class thamGiaHdService {
    private apiUrl = environment.api;
    //private thamGiaHds!: BehaviorSubject<ThamGiaHd>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<ThamGiaHd[]> {
      return this.http.get<ThamGiaHd[]>(`${this.apiUrl}/api/Thamgiahds`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaHD: string):Observable<ThamGiaHd> {
      return this.http.get<ThamGiaHd>(`${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${MaGV}&MaHD=${MaHD}`, this.shareService.httpOptions);
    }

    add(thamGiaHd: ThamGiaHd): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Thamgiahds`, thamGiaHd, this.shareService.httpOptions);
    }

    update(thamGiaHd: ThamGiaHd): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${thamGiaHd.maGv}&MaHD=${thamGiaHd.maHd}`, thamGiaHd, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaHD: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${MaGV}&MaHD=${MaHD}`, this.shareService.httpOptions);
    }
}
