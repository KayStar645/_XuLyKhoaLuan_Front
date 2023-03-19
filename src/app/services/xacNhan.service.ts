import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { XacNhan } from '../models/XacNhan.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class xacNhanService {
    private apiUrl = environment.api;
    //private xacNhans!: BehaviorSubject<XacNhan>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<XacNhan[]> {
      return await this.http.get<XacNhan[]>(`${this.apiUrl}/api/Xacnhans`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(MaGV: string, MaDT: string):Promise<XacNhan> {
      try {
        var response = new XacNhan();
        response = await this.http.get<XacNhan>(
          `${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as XacNhan;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(XacNhan: XacNhan): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Xacnhans`, 
      XacNhan, this.shareService.httpOptions).toPromise();
    }

    async update(XacNhan: XacNhan): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${XacNhan.maGv}&MaDT=${XacNhan.maDt}`, 
      XacNhan, this.shareService.httpOptions).toPromise();
    }

    async delete(MaGV: string, MaDT: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Xacnhans/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`, 
      this.shareService.httpOptions).toPromise();
    }
}
