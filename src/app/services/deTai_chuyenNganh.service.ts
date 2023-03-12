import { DeTai_ChuyenNganh } from './../models/DeTai_ChuyenNganh.model';
import { shareService } from 'src/app/services/share.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
    providedIn: "root",
})
export class deTai_chuyenNganhService {
    private apiUrl = environment.api;

    constructor(
        private http: HttpClient,
        private shareService: shareService
        ){}

    getAll(): Observable<DeTai_ChuyenNganh[]>{
        return this.http.get<DeTai_ChuyenNganh[]>(`${this.apiUrl}/api/DetaiChuyennganh`, this.shareService.httpOptions);
    }

    getByMaDtMaCn(MaDT: string, MaCN:string):Observable<DeTai_ChuyenNganh[]> {
        return this.http.get<DeTai_ChuyenNganh[]>(`${this.apiUrl}/api/DetaiChuyennganh/maDT, maCN?maDT=${MaDT}&maCN=${MaCN}`,
         this.shareService.httpOptions);
    }

    add(deTai_chuyenNganh: DeTai_ChuyenNganh): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/DetaiChuyennganh`, deTai_chuyenNganh, this.shareService.httpOptions);
    }

    delete(MaDT: string, MaCN:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/DetaiChuyennganh/maDT, maCN?maDT=${MaDT}&maCN=${MaCN}`, this.shareService.httpOptions);
    }
}