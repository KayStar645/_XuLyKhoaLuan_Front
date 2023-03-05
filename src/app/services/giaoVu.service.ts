import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { GiaoVu } from '../models/GiaoVu.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class giaoVuService {
    private apiUrl = environment.api;
    private giaoVus!: BehaviorSubject<GiaoVu>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<GiaoVu[]> {
      return this.http.get<GiaoVu[]>(`${this.apiUrl}/api/Giaovus`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<GiaoVu> {
      return this.http.get<GiaoVu>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${id}`, this.shareService.httpOptions);
    }

    add(giaoVu: GiaoVu): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Giaovus`, giaoVu, this.shareService.httpOptions);
    }

    update(giaoVu: GiaoVu): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${giaoVu.maGv}`, giaoVu, this.shareService.httpOptions);
    }

    delete(maGV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${maGV}`, this.shareService.httpOptions);
    }
}
