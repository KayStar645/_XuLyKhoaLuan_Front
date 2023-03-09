import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HoiDong } from '../models/HoiDong.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hoiDongService {
    private apiUrl = environment.api;
    //private hoiDongs!: BehaviorSubject<HoiDong>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HoiDong[]> {
      return this.http.get<HoiDong[]>(`${this.apiUrl}/api/Hoidongs`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<HoiDong> {
      return this.http.get<HoiDong>(`${this.apiUrl}/api/Hoidongs/MaHD?MaHD=${id}`, this.shareService.httpOptions);
    }

    add(hoidong: HoiDong): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hoidongs`, hoidong, this.shareService.httpOptions);
    }

    update(hoidong: HoiDong): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hoidongs/MaHD?MaHD=${hoidong.maHd}`, hoidong, this.shareService.httpOptions);
    }

    delete(maHD: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hoidongs/MaHD?MaHD=${maHD}`, this.shareService.httpOptions);
    }
}
