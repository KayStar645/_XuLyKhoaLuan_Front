import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class deTaiService {
    private apiUrl = environment.api;
    //private deTais!: BehaviorSubject<DeTai>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<DeTai[]> {
      return await this.http.get<DeTai[]>(`${this.apiUrl}/api/Detais`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string):Promise<DeTai> {
      try {
        var response = new DeTai();
        response = await this.http.get<DeTai>(
          `${this.apiUrl}/api/Detais/maDT?maDT=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DeTai;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async getByChuyenNganh(maCN: string):Promise<DeTai[]> {
      try {
        var response : DeTai[] = [];
        response = await this.http.get<DeTai[]>(
          `${this.apiUrl}/api/Detais/MaCN?MaCN=${maCN}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DeTai[];
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async getChuyennganhOfDetai(maDT: string) {
      try {
        var response : DeTai[] = [];
        response = await this.http.get<DeTai[]>(
          `${this.apiUrl}/api/Detais/MaDeTai?MaDeTai=${maDT}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DeTai[];
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async searchByName(tenGV: string):Promise<DeTai[]> {
      try {
        var response : DeTai[] = [];
        response = await this.http.get<DeTai[]>(
          `${this.apiUrl}/api/Detais/tenDT?tenDT=${tenGV}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DeTai[];
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(deTai: DeTai): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Detais`, deTai, this.shareService.httpOptions);
    }

    //Tóm tắt không được để trống
    async update(deTai: DeTai): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Detais/maDT?maDT=${deTai.maDT}`, deTai, this.shareService.httpOptions);
    }

    async delete(maDT: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Detais/maDT?maDT=${maDT}`, this.shareService.httpOptions);
    }
}
