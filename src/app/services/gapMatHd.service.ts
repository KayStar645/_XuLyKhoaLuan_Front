import { GapMatHd } from './../models/GapMatHd.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { shareService } from './../services/share.service';

@Injectable({
   providedIn: 'root',
})
export class GapMatHdService {
   private apiUrl = environment.api;

   constructor(private http: HttpClient, private shareService: shareService) {}

   async add(GapMatHd: GapMatHd): Promise<any> {
      return await this.http
         .post(`${this.apiUrl}/api/GapMatHd`, GapMatHd, this.shareService.httpOptions)
         .toPromise();
   }

   async update(GapMatHd: GapMatHd): Promise<any> {
      return await this.http
         .put<any>(
            `${this.apiUrl}/api/GapMatHd/id?id=${GapMatHd.id}`,
            GapMatHd,
            this.shareService.httpOptions
         )
         .toPromise();
   }
}
