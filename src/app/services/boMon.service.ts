import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { BoMon } from '../models/BoMon.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class boMonService {
    private apiUrl = environment.api;
    //private boMons!: BehaviorSubject<BoMon>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    getAll(): Observable<BoMon[]> {
      return this.http.get<BoMon[]>(`${this.apiUrl}/api/Bomons`, this.shareService.httpOptions);
    }

    getById(id: string):Observable<BoMon> {
      return this.http.get<BoMon>(`${this.apiUrl}/api/Bomons/MaBM?MaBM=${id}`, this.shareService.httpOptions);
    }

    add(boMon: BoMon): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Bomons`, boMon, this.shareService.httpOptions);
    }

    update(boMon: BoMon): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/api/Bomons/MaBM?MaBM=${boMon.maBm}`, boMon, this.shareService.httpOptions);
    }

    delete(MaBM: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/Bomons/MaBM?MaBM=${MaBM}`, this.shareService.httpOptions);
    }
}
