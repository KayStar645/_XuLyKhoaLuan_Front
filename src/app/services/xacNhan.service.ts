import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { XacNhan } from '../models/XacNhan.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class xacNhanService {
    private apiUrl = environment.api;
    private xacNhans!: BehaviorSubject<XacNhan>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<XacNhan[]> {
      return this.http.get<XacNhan[]>(`${this.apiUrl}/api/Xacnhans`, this.shareService.httpOptions);
    }

    getById(MaGV: string, MaDT: string):Observable<XacNhan> {
      return this.http.get<XacNhan>(`${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }

    add(XacNhan: XacNhan): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Xacnhans`, XacNhan, this.shareService.httpOptions);
    }

    update(XacNhan: XacNhan): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${XacNhan.maGv}&MaDT=${XacNhan.maDt}`, XacNhan, this.shareService.httpOptions);
    }

    delete(MaGV: string, MaDT: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
