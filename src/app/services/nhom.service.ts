import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Nhom } from '../models/Nhom.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class nhomService {
    private apiUrl = environment.api;
    private nhoms!: BehaviorSubject<Nhom>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<Nhom[]> {
      return this.http.get<Nhom[]>(`${this.apiUrl}/api/Nhoms`, this.shareService.httpOptions);
    }

    getById(MaNhom: number):Observable<Nhom> {
      return this.http.get<Nhom>(`${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${MaNhom}`, this.shareService.httpOptions);
    }

    add(nhom: Nhom): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Nhoms`, nhom, this.shareService.httpOptions);
    }

    update(nhom: Nhom): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${nhom.maNhom}`, nhom, this.shareService.httpOptions);
    }

    delete(MaNhom: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${MaNhom}`, this.shareService.httpOptions);
    }
}
