import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ThamGiaHd } from '../models/ThamGiaHd.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class thamGiaHdService {
    private apiUrl = environment.api;
    //private thamGiaHds!: BehaviorSubject<ThamGiaHd>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<ThamGiaHd[]> {
      return await this.http.get<ThamGiaHd[]>(`${this.apiUrl}/api/Thamgiahds`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaGV: string, MaHD: string):Promise<ThamGiaHd> {
      try {
        var response = new ThamGiaHd();
        response = await this.http.get<ThamGiaHd>(
          `${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${MaGV}&MaHD=${MaHD}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as ThamGiaHd;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(thamGiaHd: ThamGiaHd): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Thamgiahds`, thamGiaHd, this.shareService.httpOptions);
    }

    async update(thamGiaHd: ThamGiaHd): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${thamGiaHd.maGv}&MaHD=${thamGiaHd.maHd}`, thamGiaHd, this.shareService.httpOptions);
    }

    async delete(MaGV: string, MaHD: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Thamgiahds/MaGV, MaHD?MaGV=${MaGV}&MaHD=${MaHD}`, this.shareService.httpOptions);
    }
}
