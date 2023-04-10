import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CongViec } from '../models/CongViec.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class congViecService {
    private apiUrl = environment.api;
    //private CongViecs!: BehaviorSubject<CongViec>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<CongViec[]> {
      return await this.http.get<CongViec[]>(`${this.apiUrl}/api/Congviecs`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(maCV: string):Promise<CongViec> {
      try {
        var response = new CongViec();
        response = await this.http.get<CongViec>(
          `${this.apiUrl}/api/Congviecs/maCV?maCV=${maCV}`, this.shareService.httpOptions)
          .toPromise() ?? response as CongViec;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(CongViec: CongViec): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Congviecs`, CongViec, this.shareService.httpOptions).toPromise();
    }

    async update(CongViec: CongViec): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Congviecs/maCV?maCV=${CongViec.maCv}`, CongViec, 
      this.shareService.httpOptions).toPromise();
    }

    async delete(maCV: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Congviecs/maCV?maCV=${maCV}`, 
      this.shareService.httpOptions).toPromise();
    }

    async isHaveCongViecForGroup(maNhom: string): Promise<boolean> {
      return (await this.getAll()).filter(cv => cv.maNhom === maNhom).length > 0 ? true : false;
    }

    async getAllCongViecForGroup(maNhom: string): Promise<CongViec[]> {
      return (await this.getAll()).filter(cv => cv.maNhom === maNhom);
    }
}
