import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ThongBao } from '../models/ThongBao.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class thongBaoService {
    private apiUrl = environment.api;
    //private thongBaos!: BehaviorSubject<ThongBao>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<ThongBao[]> {
      return await this.http.get<ThongBao[]>(`${this.apiUrl}/api/Thongbaos`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaTB: number):Promise<ThongBao> {
      try {
        var response = new ThongBao();
        response = await this.http.get<ThongBao>(
          `${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${MaTB}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as ThongBao;
        return response;
      } catch (error) {
        throw error;
      }
    }

    async add(ThongBao: ThongBao): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Thongbaos`, 
      ThongBao, this.shareService.httpOptions).toPromise();
    }

    async update(ThongBao: ThongBao): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${ThongBao.maTb}`, 
      ThongBao, this.shareService.httpOptions).toPromise();
    }

    async delete(MaTB: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Thongbaos/MaTB?MaTB=${MaTB}`, 
      this.shareService.httpOptions).toPromise();
    }
}
