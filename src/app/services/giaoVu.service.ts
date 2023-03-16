import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { GiaoVu } from '../models/GiaoVu.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class giaoVuService {
    private apiUrl = environment.api;
    //private giaoVus!: BehaviorSubject<GiaoVu>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<GiaoVu[]> {
      return await this.http.get<GiaoVu[]>(`${this.apiUrl}/api/Giaovus`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string):Promise<GiaoVu> {
      try {
        var response = new GiaoVu();
        response = await this.http.get<GiaoVu>(
          `${this.apiUrl}/api/Giaovus/MaGV?MaGV=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as GiaoVu;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(giaoVu: GiaoVu): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Giaovus`, giaoVu, this.shareService.httpOptions);
    }

    async update(giaoVu: GiaoVu): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${giaoVu.maGv}`, giaoVu, this.shareService.httpOptions);
    }

    async delete(maGV: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Giaovus/MaGV?MaGV=${maGV}`, this.shareService.httpOptions);
    }
}
