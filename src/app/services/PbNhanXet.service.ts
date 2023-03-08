import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PbNhanXet } from '../models/PbNhanXet.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class pbNhanXetService {
    private apiUrl = environment.api;
    private pbNhanXets!: BehaviorSubject<PbNhanXet>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<PbNhanXet[]> {
      return this.http.get<PbNhanXet[]>(`${this.apiUrl}/api/Pbnhanxets`, this.shareService.httpOptions);
    }

    getById(id: number):Observable<PbNhanXet> {
      return this.http.get<PbNhanXet>(`${this.apiUrl}/api/Pbnhanxets/id?id=${id}`, this.shareService.httpOptions);
    }

    add(PbNhanXet: PbNhanXet): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Pbnhanxets`, PbNhanXet, this.shareService.httpOptions);
    }

    update(PbNhanXet: PbNhanXet): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Pbnhanxets/id?id=${PbNhanXet.id}`, PbNhanXet, this.shareService.httpOptions);
    }

    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Pbnhanxets/id?id=${id}`, this.shareService.httpOptions);
    }
}
