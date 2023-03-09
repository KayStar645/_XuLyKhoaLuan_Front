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

    getAll(): Observable<VaiTro[]> {
      return this.http.get<VaiTro[]>(`${this.apiUrl}/api/Vaitros`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<VaiTro> {
      return this.http.get<VaiTro>(`${this.apiUrl}/api/Vaitros/MaVT?MaVT=${id}`, this.shareService.httpOptions);
    }

    add(vaiTro: VaiTro): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Vaitros`, vaiTro, this.shareService.httpOptions);
    }

    update(vaiTro: VaiTro): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Vaitros/MaVT?MaVT=${vaiTro.maVt}`, vaiTro, this.shareService.httpOptions);
    }

    delete(MaVT: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Vaitros/MaVT?MaVT=${MaVT}`, this.shareService.httpOptions);
    }
}
