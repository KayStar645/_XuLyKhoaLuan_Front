import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PhanBien } from '../models/PhanBien.model';
import { RaDe } from '../models/RaDe.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class raDeService {
    private apiUrl = environment.api;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<RaDe[]> {
      return await this.http.get<RaDe[]>(`${this.apiUrl}/api/Rade`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getByMaGvMaDt(MaGV: string, MaDT:string):Promise<RaDe[]> {
      try {
        var response: RaDe[] = [];
        response = await this.http.get<RaDe[]>(
          `${this.apiUrl}/api/Rade/maGV, maDT?maGV=${MaGV}&maDT=${MaDT}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as RaDe[];
        return response;
      } catch (error) {
        throw error;
      }
    }

    async add(raDe: RaDe): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Rade`, 
      raDe, this.shareService.httpOptions).toPromise();
    }

    async delete(MaGV: string, MaDT:string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Rade/MaGV, maDT?maGV=${MaGV}&maDT=${MaDT}`, 
      this.shareService.httpOptions).toPromise();
    }
}