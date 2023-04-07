import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

    async getAll(): Promise<ChuyenNganh[]> {
      return await this.http.get<ChuyenNganh[]>(`${this.apiUrl}/api/Chuyennganhs`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string): Promise<ChuyenNganh> {
      try {
        var chuyenNganh = new ChuyenNganh();
        chuyenNganh = await this.http.get<ChuyenNganh>(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${id}`, 
        this.shareService.httpOptions).toPromise() ?? chuyenNganh as ChuyenNganh;
        return chuyenNganh;
      } catch (error) {
        throw error;
      }
    }

    async add(chuyenNganh: ChuyenNganh): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Chuyennganhs`, chuyenNganh, this.shareService.httpOptions).toPromise();
    }

    async update(chuyenNganh: ChuyenNganh): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${chuyenNganh.maCn}`, chuyenNganh,
       this.shareService.httpOptions).toPromise();
    }

    async delete(maCN: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Chuyennganhs/maCN?maCN=${maCN}`, this.shareService.httpOptions).toPromise();
    }
}
