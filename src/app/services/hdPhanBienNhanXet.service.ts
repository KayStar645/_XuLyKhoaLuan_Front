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

    async getAll(): Promise<HdpbNhanXet[]> {
      return await this.http.get<HdpbNhanXet[]>(`${this.apiUrl}/api/Hdpbnhanxets`, 
      this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: number):Promise<HdpbNhanXet> {
      try {
        var response = new HdpbNhanXet();
        response = await this.http.get<HdpbNhanXet>(
          `${this.apiUrl}/api/Hdpbnhanxets/id?id=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as HdpbNhanXet;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(HdpbNhanXet: HdpbNhanXet): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Hdpbnhanxets`, HdpbNhanXet, 
      this.shareService.httpOptions).toPromise();
    }

    async update(HdpbNhanXet: HdpbNhanXet): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Hdpbnhanxets/id?id=${HdpbNhanXet.id}`, 
      HdpbNhanXet, this.shareService.httpOptions).toPromise();
    }

    async delete(id: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Hdpbnhanxets/id?id=${id}`, 
      this.shareService.httpOptions).toPromise();
    }
}
