import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CongViec } from '../models/CongViec.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class congViecService {
    private apiUrl = environment.api;
    private CongViecs!: BehaviorSubject<CongViec>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<CongViec[]> {
      return this.http.get<CongViec[]>(`${this.apiUrl}/api/Congviecs`, this.shareService.httpOptions);
    }

    getById(maCV: string):Observable<CongViec> {
      return this.http.get<CongViec>(`${this.apiUrl}/api/Congviecs/maCV?maCV=${maCV}`, this.shareService.httpOptions);
    }

    add(CongViec: CongViec): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Congviecs`, CongViec, this.shareService.httpOptions);
    }

    update(CongViec: CongViec): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Congviecs/maCV?maCV=${CongViec.maCv}`, CongViec, this.shareService.httpOptions);
    }

    delete(maCV: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Congviecs/maCV?maCV=${maCV}`, this.shareService.httpOptions);
    }
}
