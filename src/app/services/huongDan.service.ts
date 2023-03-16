import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HuongDan } from '../models/HuongDan.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class huongDanService {
    private apiUrl = environment.api;
    //private huongDans!: BehaviorSubject<HuongDan>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<HuongDan[]> {
      return await this.http.get<HuongDan[]>(`${this.apiUrl}/api/Huongdans`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaGV: string, MaDT: string):Promise<HuongDan> {
      try {
        var response = new HuongDan();
        response = await this.http.get<HuongDan>(
          `${this.apiUrl}/api/Huongdans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as HuongDan;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(huongDan: HuongDan): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Huongdans`, huongDan, this.shareService.httpOptions);
    }

    async update(huongDan: HuongDan): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Huongdans/MaGV, MaDT?MaGV=${huongDan.maGv}&MaDT=${huongDan.maDt}`, huongDan, this.shareService.httpOptions);
    }

    async delete(MaGV: string, MaDT: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Huongdans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
