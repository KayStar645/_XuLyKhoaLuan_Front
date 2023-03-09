import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { KeHoach } from '../models/KeHoach.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class keHoachService {
    private apiUrl = environment.api;
    //private keHoachs!: BehaviorSubject<KeHoach>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<KeHoach[]> {
      return this.http.get<KeHoach[]>(`${this.apiUrl}/api/Kehoaches`, this.shareService.httpOptions);
    }

    getById(MaKH: number):Observable<KeHoach> {
      return this.http.get<KeHoach>(`${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${MaKH}`, this.shareService.httpOptions);
    }

    add(keHoach: KeHoach): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Kehoaches`, keHoach, this.shareService.httpOptions);
    }

    update(keHoach: KeHoach): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${keHoach.maKh}`, keHoach, this.shareService.httpOptions);
    }

    delete(MaKH: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${MaKH}`, this.shareService.httpOptions);
    }
}
