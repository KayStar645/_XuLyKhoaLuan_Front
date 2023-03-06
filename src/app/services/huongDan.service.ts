import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HuongDan } from '../models/HuongDan.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class huongDanService {
    private apiUrl = environment.api;
    private huongDans!: BehaviorSubject<HuongDan>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HuongDan[]> {
      return this.http.get<HuongDan[]>(`${this.apiUrl}/api/Huongdans`, this.shareService.httpOptions);
    }

    add(huongDan: HuongDan): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Huongdans`, huongDan, this.shareService.httpOptions);
    }
}
