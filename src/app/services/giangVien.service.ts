import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { GiangVien } from '../models/GiangVien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class giangVienService {
    private apiUrl = environment.api;
    //private giangViens!: BehaviorSubject<GiangVien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<GiangVien[]> {
      return await this.http.get<GiangVien[]>(`${this.apiUrl}/api/Giangviens`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string):Promise<GiangVien> {
      try {
        var response = new GiangVien();
        response = await this.http.get<GiangVien>(
          `${this.apiUrl}/api/Giangviens/MaGV?MaGV=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as GiangVien;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async getByBoMon(maBM: string):Promise<GiangVien[]> {
      try {
        var response : GiangVien[] = [];
        response = await this.http.get<GiangVien[]>(
          `${this.apiUrl}/api/Giangviens/MaBM?MaBM=${maBM}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as GiangVien[];
        return response;
      } catch (error) {
        throw error;
      }
    }

    async searchByName(tenGV: string):Promise<GiangVien[]> {
      try {
        var response: GiangVien[] = [];
        response = await this.http.get<GiangVien[]>(
          `${this.apiUrl}/api/Giangviens/tenGV?tenGV=${tenGV}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as GiangVien[];
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(giangVien: GiangVien): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Giangviens`, giangVien, this.shareService.httpOptions);
    }

    async update(giangVien: GiangVien): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${giangVien.maGv}`, giangVien, this.shareService.httpOptions);
    }

    async delete(maGV: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Giangviens/MaGV?MaGV=${maGV}`, this.shareService.httpOptions);
    }
}
