import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TruongBm } from '../models/TruongBm.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class truongBmService {
    private apiUrl = environment.api;
    //private truongBms!: BehaviorSubject<TruongBm>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<TruongBm[]> {
      return this.http.get<TruongBm[]>(`${this.apiUrl}/api/Truongbms`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaBM: string):Observable<TruongBm> {
      return this.http.get<TruongBm>(`${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${MaGV}&MaBM=${MaBM}`, this.shareService.httpOptions);
    }

    add(TruongBm: TruongBm): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Truongbms`, TruongBm, this.shareService.httpOptions);
    }

    update(TruongBm: TruongBm): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${TruongBm.maGv}&MaBM=${TruongBm.maBm}`, TruongBm, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaBM: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${MaGV}&MaBM=${MaBM}`, this.shareService.httpOptions);
    }
}
