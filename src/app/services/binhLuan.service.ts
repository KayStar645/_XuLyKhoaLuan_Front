import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { BinhLuan } from '../models/BinhLuan.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class binhLuanService {
    private apiUrl = environment.api;
    //private BinhLuans!: BehaviorSubject<BinhLuan>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<BinhLuan[]> {
      return await this.http.get<BinhLuan[]>(`${this.apiUrl}/api/Binhluans`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async add(BinhLuan: BinhLuan): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Binhluans`, BinhLuan, this.shareService.httpOptions).toPromise();
    }
}
