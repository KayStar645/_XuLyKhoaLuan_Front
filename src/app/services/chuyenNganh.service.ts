import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ChuyenNganh } from '../models/ChuyenNganh.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class chuyenNganhService {
    tenCn: string = '';
    private apiUrl = environment.api;
    //private chuyenNganhs!: BehaviorSubject<ChuyenNganh>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<ChuyenNganh[]> {
      return this.http.get<ChuyenNganh[]>(`${this.apiUrl}/api/Chuyennganhs`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<ChuyenNganh> {
      return this.http.get<ChuyenNganh>(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${id}`, this.shareService.httpOptions);
    }

    // getTenChuyenNganhById(id: string):string {
    //   this.http.get<ChuyenNganh>(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${id}`, this.shareService.httpOptions).subscribe(nhom => this.tenCn = nhom.tenCn);
    //   return this.tenCn;
    // }

    add(chuyenNganh: ChuyenNganh): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Chuyennganhs`, chuyenNganh, this.shareService.httpOptions);
    }

    update(chuyenNganh: ChuyenNganh): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${chuyenNganh.maCn}`, chuyenNganh, this.shareService.httpOptions);
    }

    delete(maCN: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${maCN}`, this.shareService.httpOptions);
    }
}
