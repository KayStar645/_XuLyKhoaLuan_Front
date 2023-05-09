import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdCham } from '../models/HdCham.model';
import { HoiDong } from '../models/HoiDong.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdChamService {
    private apiUrl = environment.api;
    //private HdChams!: BehaviorSubject<HdCham>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<HdCham[]> {
      return await this.http.get<HdCham[]>(`${this.apiUrl}/api/Hdchams`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaGV: string, MaDT: string):Promise<HdCham> {
      try {
        var response = new HdCham();
        response = await this.http.get<HdCham>(
          `${this.apiUrl}/api/Hdchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as HdCham;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(HdCham: HdCham): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Hdchams`,
       HdCham, this.shareService.httpOptions).toPromise();
    }

    async update(HdCham: HdCham): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Hdchams/MaGV, MaDT?MaGV=${HdCham.maGv}&MaDT=${HdCham.maDt}`, 
      HdCham, this.shareService.httpOptions).toPromise();
    }

    async delete(MaGV: string, MaDT: string, maSv: string, namHoc: string, dot: number): Promise<any> {
      return await this.http
        .delete(
          `${this.apiUrl}/api/Hdchams/MaGV, MaDT, maSv, namHoc, dot?MaGV=${MaGV}&MaDT=${MaDT}&maSv=${maSv}&namHoc=${namHoc}&dot=${dot}`,
          this.shareService.httpOptions
        )
        .toPromise();
    }
}
