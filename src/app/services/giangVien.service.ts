
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from 'src/environments/environment';
import { GiangVien } from '../models/GiangVien.model';
import { GiaoVu } from '../models/GiaoVu.model';

@Injectable({
  providedIn: 'root',
})
export class giangVienService {
    private apiUrl = environment.api;
    private giangViens!: BehaviorSubject<GiangVien>;
    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: 'my-auth-token'
      }),
    };

    constructor(private http: HttpClient, private router: Router) {}

    // Chạy được
    getAll(): Observable<GiangVien[]> {
      return this.http.get<GiangVien[]>(`${this.apiUrl}/api/Giangviens`);
    }

    // Chạy được
    getById(id: string):Observable<GiangVien> {
      return this.http.get<GiangVien>(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${id}`);
    }

    getById2(id: string):Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/api/GiangVien/MaGV?MaGV=${id}`, this.httpOptions);
    }

    // Chạy được
    add(GiangVien: GiangVien): Observable<any> {
      return this.http.post<GiangVien>(`${this.apiUrl}/api/Giaovus`, GiangVien);
    }

    // Chạy được
    update(GiangVien: GiangVien): Observable<GiangVien> {
      return this.http.put<GiangVien>(`${this.apiUrl}/api/GiangVien/MaGV?MaGV=${GiangVien.maGv}`, GiangVien);
    }

    // Chạy được
    delete(maGV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/GiangVien/MaGV?MaGV=${maGV}`);
    }

    // Các nghiệp vụ khác nếu có
}
