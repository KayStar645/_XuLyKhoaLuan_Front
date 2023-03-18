import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DeTai } from '../models/DeTai.model';
import { DotDk } from '../models/DotDk.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class dotDkService {
    private apiUrl = environment.api;
    //private dotDks!: BehaviorSubject<DotDk>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    //Được
    async getAll(): Promise<DotDk[]> {
      return await this.http.get<DotDk[]>(`${this.apiUrl}/api/Dotdks`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(namhoc: string, dot:number):Promise<DotDk> {
      try {
        var response = new DotDk();
        response = await this.http.get<DotDk>(
          `${this.apiUrl}/api/Dotdks/NamHoc, Dot?NamHoc=${namhoc}&Dot=${dot}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as DotDk;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(dotDk: DotDk): Promise<any> {
      return this.http.post(`${this.apiUrl}/api/Dotdks`, dotDk, this.shareService.httpOptions).toPromise();
    }

    async delete(namhoc: string, dot:number): Promise<any> {
      return this.http.delete(`${this.apiUrl}/api/Dotdks/NamHoc, Dot?NamHoc=${namhoc}&Dot=${dot}`, 
      this.shareService.httpOptions).toPromise();
    }
}
