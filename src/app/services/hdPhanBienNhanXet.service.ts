import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdpbNhanXet } from '../models/HdpbNhanXet.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdPhanBienNhanXetService {
    private apiUrl = environment.api;
    //private HdpbNhanXets!: BehaviorSubject<HdpbNhanXet>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HdpbNhanXet[]> {
      return this.http.get<HdpbNhanXet[]>(`${this.apiUrl}/api/Hdpbnhanxets`, this.shareService.httpOptions);
    }

    getById(id: number):Observable<HdpbNhanXet> {
        return this.http.get<HdpbNhanXet>(`${this.apiUrl}/api/Hdpbnhanxets/id?id=${id}`, this.shareService.httpOptions);
      }

    add(HdpbNhanXet: HdpbNhanXet): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hdpbnhanxets`, HdpbNhanXet, this.shareService.httpOptions);
    }

    update(HdpbNhanXet: HdpbNhanXet): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hdpbnhanxets/id?id=${HdpbNhanXet.id}`, HdpbNhanXet, this.shareService.httpOptions);
    }

    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hdpbnhanxets/id?id=${id}`, this.shareService.httpOptions);
    }
}
