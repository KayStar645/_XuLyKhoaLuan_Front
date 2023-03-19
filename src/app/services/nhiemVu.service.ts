import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { NhiemVu } from '../models/NhiemVu.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class nhiemVuService {
    private apiUrl = environment.api;
    //private nhiemVus!: BehaviorSubject<NhiemVu>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<NhiemVu[]> {
      return await this.http.get<NhiemVu[]>(`${this.apiUrl}/api/Nhiemvus`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaNV: number):Promise<NhiemVu> {
      try {
        var response = new NhiemVu();
        response = await this.http.get<NhiemVu>(
          `${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${MaNV}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as NhiemVu;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(nhiemVu: NhiemVu): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Nhiemvus`, 
      nhiemVu, this.shareService.httpOptions).toPromise();
    }

    async update(nhiemVu: NhiemVu): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${nhiemVu.maNv}`, 
      nhiemVu, this.shareService.httpOptions).toPromise();
    }

    async delete(MaNV: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Nhiemvus/MaNV?MaNV=${MaNV}`, 
      this.shareService.httpOptions).toPromise();
    }
}
