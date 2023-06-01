import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DuyetDt } from '../models/DuyetDt.model';
import { shareService } from './share.service';

@Injectable({
   providedIn: 'root',
})
export class duyetDtService {
   private apiUrl = environment.api;
   //private duyetDts!: BehaviorSubject<DuyetDt>;

   constructor(
      private http: HttpClient,
      private router: Router,
      private shareService: shareService
   ) {}

   async getAll(): Promise<DuyetDt[]> {
      return (
         (await this.http
            .get<DuyetDt[]>(`${this.apiUrl}/api/Duyetdts`, this.shareService.httpOptions)
            .toPromise()) ?? []
      );
   }

   async getById(MaGV: string, MaDT: string, LanDuyet: number): Promise<DuyetDt> {
      try {
         var response = new DuyetDt();
         response =
            (await this.http
               .get<DuyetDt>(
                  `${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${MaGV}&MaDT=${MaDT}&LanDuyet=${LanDuyet}`,
                  this.shareService.httpOptions
               )
               .toPromise()) ?? (response as DuyetDt);
         return response;
      } catch (error) {
         console.error(error);
         throw error;
      }
   }

   async getByMadt(maDt: string) {
      return (
         (await this.http
            .get<DuyetDt[]>(
               `${this.apiUrl}/api/Duyetdts/maDt?maDt=${maDt}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   //Ngày duyệt phải theo chuẩn ngày tháng năm
   async add(duyetDt: DuyetDt): Promise<any> {
      return await this.http
         .post(`${this.apiUrl}/api/Duyetdts`, duyetDt, this.shareService.httpOptions)
         .toPromise();
   }

   async UpdateTrangthaiDetai(maDT: string, maGV: string, trangThai: boolean): Promise<any> {
      return await this.http
         .post(
            `${this.apiUrl}/api/Duyetdts/maDT, maGV, trangThai?maDT=${maDT}&maGV=${maGV}&trangThai=${trangThai}`,
            this.shareService.httpOptions
         )
         .toPromise();
   }

   async update(duyetDt: DuyetDt): Promise<any> {
      return await this.http
         .put<any>(
            `${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${duyetDt.maGv}&MaDT=${duyetDt.maDt}&LanDuyet=${duyetDt.lanDuyet}`,
            duyetDt,
            this.shareService.httpOptions
         )
         .toPromise();
   }

   async delete(MaGV: string, MaDT: string, LanDuyet: number): Promise<any> {
      return await this.http
         .delete(
            `${this.apiUrl}/api/Duyetdts/MaGV, MaDT, LanDuyet?MaGV=${MaGV}&MaDT=${MaDT}&LanDuyet=${LanDuyet}`,
            this.shareService.httpOptions
         )
         .toPromise();
   }
}
