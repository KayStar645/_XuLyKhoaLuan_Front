import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Nhom } from '../models/Nhom.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class nhomService {
    private apiUrl = environment.api;
    //private nhoms!: BehaviorSubject<Nhom>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<Nhom[]> {
      return await this.http.get<Nhom[]>(`${this.apiUrl}/api/Nhoms`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaNhom: number):Promise<Nhom> {
      try {
        var response = new Nhom();
        response = await this.http.get<Nhom>(
          `${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${MaNhom}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as Nhom;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(nhom: Nhom): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Nhoms`, nhom, this.shareService.httpOptions).toPromise();
    }

    async update(nhom: Nhom): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${nhom.maNhom}`, 
      nhom, this.shareService.httpOptions).toPromise();
    }

    async delete(MaNhom: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Nhoms/MaNhom?MaNhom=${MaNhom}`, 
      this.shareService.httpOptions).toPromise();
    }

    async countThanhVien(MaNhom: string): Promise<number> {
      return await this.http.get<number>(`${this.apiUrl}/api/Nhoms/ma?ma=${MaNhom}`, 
      this.shareService.httpOptions).toPromise() ?? 0;
    }
}