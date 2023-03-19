import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Khoa } from '../models/Khoa.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class khoaService {
    private apiUrl = environment.api;
    //private khoas!: BehaviorSubject<Khoa>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<Khoa[]> {
      return await this.http.get<Khoa[]>(`${this.apiUrl}/api/Khoas`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string):Promise<Khoa> {
      try {
        var response = new Khoa();
        response = await this.http.get<Khoa>(
          `${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as Khoa;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(khoa: Khoa): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Khoas`, khoa, 
      this.shareService.httpOptions).toPromise();
    }

    async update(khoa: Khoa): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${khoa.maKhoa}`, 
      khoa, this.shareService.httpOptions).toPromise();
    }

    async delete(maKhoa: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Khoas/MaKhoa?MaKhoa=${maKhoa}`, 
      this.shareService.httpOptions).toPromise();
    }
}
