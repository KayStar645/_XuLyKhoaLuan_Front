import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Khoa } from '../models/Khoa.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class khoaService {
    private apiUrl = environment.api;
    //private khoas!: BehaviorSubject<Khoa>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<Khoa[]> {
      return this.http.get<Khoa[]>(`${this.apiUrl}/api/Khoas`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<Khoa> {
      return this.http.get<Khoa>(`${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${id}`, this.shareService.httpOptions);
    }

    add(khoa: Khoa): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Khoas`, khoa, this.shareService.httpOptions);
    }

    update(khoa: Khoa): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${khoa.maKhoa}`, khoa, this.shareService.httpOptions);
    }

    delete(maKhoa: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${maKhoa}`, this.shareService.httpOptions);
    }
}
