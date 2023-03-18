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

    async getAll(): Promise<DeTai_ChuyenNganh[]>{
        return await this.http.get<DeTai_ChuyenNganh[]>(`${this.apiUrl}/api/DetaiChuyennganh`, 
        this.shareService.httpOptions).toPromise() ?? [];
    }

    async getByMaDtMaCn(MaDT: string, MaCN:string):Promise<DeTai_ChuyenNganh[]> {
         try {
            var response : DeTai_ChuyenNganh[] = [];
            response = await this.http.get<DeTai_ChuyenNganh[]>(
              `${this.apiUrl}/api/DetaiChuyennganh/maDT, maCN?maDT=${MaDT}&maCN=${MaCN}`,
              this.shareService.httpOptions
            ).toPromise() ?? response as DeTai_ChuyenNganh[];
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
    }

    async add(deTai_chuyenNganh: DeTai_ChuyenNganh): Promise<any> {
    return await this.http.post(`${this.apiUrl}/api/DetaiChuyennganh`, deTai_chuyenNganh, this.shareService.httpOptions).toPromise();
    }

    async delete(MaDT: string, MaCN:string): Promise<any> {
    return await this.http.delete(`${this.apiUrl}/api/DetaiChuyennganh/maDT, maCN?maDT=${MaDT}&maCN=${MaCN}`, 
    this.shareService.httpOptions).toPromise();
    }
}