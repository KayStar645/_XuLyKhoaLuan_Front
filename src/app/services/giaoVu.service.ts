
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from 'src/environments/environment';
import { GiaoVu } from '../models/GiaoVu.model';

@Injectable({
  providedIn: 'root',
})
export class giaoVuService {
    private apiUrl = environment.api;
    private giaoVus!: BehaviorSubject<GiaoVu>;
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'my-auth-token'
      }),
    };

    constructor(private http: HttpClient, private router: Router) {}

    // Chạy được
    getAll(): Observable<GiaoVu[]> {
      return this.http.get<GiaoVu[]>(`${this.apiUrl}/api/Giaovus`);
    }

    // Chạy được
    getById(id: string):Observable<GiaoVu> {
      return this.http.get<GiaoVu>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${id}`);
    }

    getById2(id: string):Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${id}`, this.httpOptions);
    }

    // Chạy được
    add(giaoVu: GiaoVu): Observable<any> {
      return this.http.post<GiaoVu>(`${this.apiUrl}/api/Giaovus`, giaoVu);
    }

    // Chạy được
    update(giaoVu: GiaoVu): Observable<GiaoVu> {
      return this.http.put<GiaoVu>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${giaoVu.maGv}`, giaoVu);
    }

    // Chạy được
    delete(maGV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${maGV}`);
    }

    // Các nghiệp vụ khác nếu có
    
    
    
}
