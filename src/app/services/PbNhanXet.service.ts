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
    //private pbNhanXets!: BehaviorSubject<PbNhanXet>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async getAll(): Promise<PbNhanXet[]> {
      return await this.http.get<PbNhanXet[]>(`${this.apiUrl}/api/Pbnhanxets`, this.shareService.httpOptions).toPromise() ?? [];
    }

    async getById(id: number):Promise<PbNhanXet> {
      try {
        var response = new PbNhanXet();
        response = await this.http.get<PbNhanXet>(
          `${this.apiUrl}/api/Pbnhanxets/id?id=${id}`,
          this.shareService.httpOptions
        ).toPromise() ?? response as PbNhanXet;
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async add(PbNhanXet: PbNhanXet): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Pbnhanxets`, PbNhanXet, this.shareService.httpOptions);
    }

    async update(PbNhanXet: PbNhanXet): Promise<any> {
      return await this.http.put<any>(`${this.apiUrl}/api/Pbnhanxets/id?id=${PbNhanXet.id}`, PbNhanXet, this.shareService.httpOptions);
    }

    async delete(id: number): Promise<any> {
      return await this.http.delete(`${this.apiUrl}/api/Pbnhanxets/id?id=${id}`, this.shareService.httpOptions);
    }
}
