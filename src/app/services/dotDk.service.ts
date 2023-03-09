import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { DotDk } from '../models/DotDk.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class dotDkService {
    private apiUrl = environment.api;
    //private dotDks!: BehaviorSubject<DotDk>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    //Được
    getAll(): Observable<DotDk[]> {
      return this.http.get<DotDk[]>(`${this.apiUrl}/api/Dotdks`, this.shareService.httpOptions);
    }

    getById(namhoc: string, dot:number):Observable<DotDk> {
      return this.http.get<DotDk>(`${this.apiUrl}/api/Dotdks/NamHoc, Dot?NamHoc=${namhoc}&Dot=${dot}`, this.shareService.httpOptions);
    }

    add(dotDk: DotDk): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Dotdks`, dotDk, this.shareService.httpOptions);
    }

    //Không update được do cả 2 đều là khóa chính
    update(dotDk: DotDk): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Dotdks/NamHoc, Dot?NamHoc=${dotDk.namHoc}&Dot=${dotDk.dot}`, dotDk, this.shareService.httpOptions);
    }

    delete(namhoc: string, dot:number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Dotdks/NamHoc, Dot?NamHoc=${namhoc}&Dot=${dot}`, this.shareService.httpOptions);
    }
}
