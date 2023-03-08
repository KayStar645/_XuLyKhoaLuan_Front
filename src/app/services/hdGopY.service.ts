import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HdGopi } from '../models/HdGopi.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class hdGopYService {
    private apiUrl = environment.api;
    private HdGopis!: BehaviorSubject<HdGopi>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<HdGopi[]> {
      return this.http.get<HdGopi[]>(`${this.apiUrl}/api/Hdgopies`, this.shareService.httpOptions);
    }

    getById(id: number):Observable<HdGopi> {
      return this.http.get<HdGopi>(`${this.apiUrl}/api/Hdgopies/id?id=${id}`, this.shareService.httpOptions);
    }

    add(HdGopi: HdGopi): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Hdgopies`, HdGopi, this.shareService.httpOptions);
    }

    update(HdGopi: HdGopi): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Hdgopies/id?id=${HdGopi.id}`, HdGopi, this.shareService.httpOptions);
    }

    delete(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Hdgopies/id?id=${id}`, this.shareService.httpOptions);
    }
}
