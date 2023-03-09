import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { GiangVien } from '../models/GiangVien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class giangVienService {
    private apiUrl = environment.api;
    //private giangViens!: BehaviorSubject<GiangVien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<GiangVien[]> {
      return this.http.get<GiangVien[]>(`${this.apiUrl}/api/Giangviens`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<GiangVien> {
      return this.http.get<GiangVien>(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${id}`, this.shareService.httpOptions);
    }

    getByBoMon(maBM: string):Observable<GiangVien[]> {
      return this.http.get<GiangVien[]>(`${this.apiUrl}/api/Giangviens/MaBM?MaBM=${maBM}`, this.shareService.httpOptions);
    }

    searchByName(tenGV: string):Observable<GiangVien[]> {
      return this.http.get<GiangVien[]>(`${this.apiUrl}/api/Giangviens/tenGV?tenGV=${tenGV}`, this.shareService.httpOptions);
    }

    add(giangVien: GiangVien): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Giangviens`, giangVien, this.shareService.httpOptions);
    }

    update(giangVien: GiangVien): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${giangVien.maGv}`, giangVien, this.shareService.httpOptions);
    }

    delete(maGV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${maGV}`, this.shareService.httpOptions);
    }
}
