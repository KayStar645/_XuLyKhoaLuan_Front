import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TruongBm } from '../models/TruongBm.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class truongBmService {
    private apiUrl = environment.api;
    //private truongBms!: BehaviorSubject<TruongBm>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<TruongBm[]> {
      return await this.http.get<TruongBm[]>(`${this.apiUrl}/api/Truongbms`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getByMaGvMaBm(MaGV: string, MaBM: string):Promise<TruongBm> {
      try {
        var response = new TruongBm();
        response = await this.http.get<TruongBm>(
          `${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${MaGV}&MaBM=${MaBM}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as TruongBm;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async getByMaGv(MaGV: string):Promise<TruongBm> {
      try {
        var response = new TruongBm();
        response = await this.http.get<TruongBm>(
          `${this.apiUrl}/api/Truongbms/MaGV?MaGV=${MaGV}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as TruongBm;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(TruongBm: TruongBm): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Truongbms`, 
      TruongBm, this.shareService.httpOptions).toPromise();
    }

    async update(TruongBm: TruongBm): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${TruongBm.maGv}&MaBM=${TruongBm.maBm}`, 
      TruongBm, this.shareService.httpOptions).toPromise();
    }

    async delete(MaGV: string, MaBM: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Truongbms/MaGV, MaBM?MaGV=${MaGV}&MaBM=${MaBM}`, 
      this.shareService.httpOptions).toPromise();
    }
}
