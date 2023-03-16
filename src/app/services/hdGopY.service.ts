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
    //private HdGopis!: BehaviorSubject<HdGopi>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<HdGopi[]> {
      return await this.http.get<HdGopi[]>(`${this.apiUrl}/api/Hdgopies`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: number):Promise<HdGopi> {
      try {
        var response = new HdGopi();
        response = await this.http.get<HdGopi>(
          `${this.apiUrl}/api/Hdgopies/id?id=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as HdGopi;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(HdGopi: HdGopi): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Hdgopies`, HdGopi, this.shareService.httpOptions);
    }

    async update(HdGopi: HdGopi): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Hdgopies/id?id=${HdGopi.id}`, HdGopi, this.shareService.httpOptions);
    }

    async delete(id: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Hdgopies/id?id=${id}`, this.shareService.httpOptions);
    }
}
