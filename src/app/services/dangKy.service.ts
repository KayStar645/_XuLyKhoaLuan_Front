import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DangKy } from '../models/DangKy.model';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class dangKyService {
    private apiUrl = environment.api;
    //private DangKys!: BehaviorSubject<DangKy>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<DangKy[]> {
      return await this.http.get<DangKy[]>(`${this.apiUrl}/api/Dangkys`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(maDT: string, maNhom: number):Promise<DangKy> {
      try {
        var response = new DangKy();
        response = await this.http.get<DangKy>(
          `${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${maDT}&maNhom=${maNhom}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DangKy;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(DangKy: DangKy): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Dangkys`, DangKy, this.shareService.httpOptions).toPromise();
    }

    async update(DangKy: DangKy): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${DangKy.maDt}&maNhom=${DangKy.maNhom}`, DangKy, 
      this.shareService.httpOptions).toPromise();
    }

    async delete(maDT: string, maNhom: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Dangkys/maDT, maNhom?maDT=${maDT}&maNhom=${maNhom}`, 
      this.shareService.httpOptions).toPromise();
    }
}
