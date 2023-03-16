import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { VaiTro } from '../models/VaiTro.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class vaiTroService {
    private apiUrl = environment.api;
    //private vaiTros!: BehaviorSubject<VaiTro>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<VaiTro[]> {
      return await this.http.get<VaiTro[]>(`${this.apiUrl}/api/Vaitros`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: string):Promise<VaiTro> {
      try {
        var response = new VaiTro();
        response = await this.http.get<VaiTro>(
          `${this.apiUrl}/api/Vaitros/MaVT?MaVT=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as VaiTro;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(vaiTro: VaiTro): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Vaitros`, vaiTro, this.shareService.httpOptions);
    }

    async update(vaiTro: VaiTro): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Vaitros/MaVT?MaVT=${vaiTro.maVt}`, vaiTro, this.shareService.httpOptions);
    }

    async delete(MaVT: string): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Vaitros/MaVT?MaVT=${MaVT}`, this.shareService.httpOptions);
    }
}
