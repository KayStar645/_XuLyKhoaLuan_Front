import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdPhanBien } from '../models/HdPhanBien.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdPhanBienService {
    private apiUrl = environment.api;
    //private HdPhanBiens!: BehaviorSubject<HdPhanBien>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<HdPhanBien[]> {
      return await this.http.get<HdPhanBien[]>(`${this.apiUrl}/api/Hdphanbiens`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async add(HdPhanBien: HdPhanBien): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Hdphanbiens`, HdPhanBien, this.shareService.httpOptions);
    }

    async update(HdPhanBien: HdPhanBien): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Hdphanbiens/MaGV, MaHD, MaDT?MaGV=${HdPhanBien.maGv}&MaHD=${HdPhanBien.maHd}&MaDT=${HdPhanBien.maDt}`, HdPhanBien, this.shareService.httpOptions);
    }

    async delete(MaGV: string, MaHD: string, MaDT:string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Hdphanbiens/MaGV, MaHD, MaDT?MaGV=${MaGV}&MaHD=${MaHD}&MaDT=${MaDT}`, this.shareService.httpOptions);
    }
}
