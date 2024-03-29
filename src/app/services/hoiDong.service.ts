import { TL_HoiDongVT } from './../models/VirtualModel/TL_HoiDongVTModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HoiDong } from '../models/HoiDong.model';
import { shareService } from './../services/share.service';
import { HoiDongVT } from '../models/VirtualModel/HoiDongVTModel';
import { DeTai } from '../models/DeTai.model';

@Injectable({
   providedIn: 'root',
})
export class hoiDongService {
   private apiUrl = environment.api;
   //private hoiDongs!: BehaviorSubject<HoiDong>;

   constructor(private http: HttpClient, private shareService: shareService) {}

   async getAll(): Promise<HoiDong[]> {
      return (
         (await this.http
            .get<HoiDong[]>(
               `${this.apiUrl}/api/Hoidongs`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async GetHoidongsByBomon(maHD: string): Promise<HoiDongVT[]> {
      return (
         (await this.http
            .get<HoiDongVT[]>(
               `${this.apiUrl}/api/Hoidongs/maBm?maBm=${maHD}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async GetHoidongsByGiangvien(maGv: string): Promise<HoiDongVT[]> {
      return (
         (await this.http
            .get<HoiDongVT[]>(
               `${this.apiUrl}/api/Hoidongs/maGv?maGv=${maGv}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async getById(id: string): Promise<HoiDong> {
      try {
         var response = new HoiDong();
         response =
            (await this.http
               .get<HoiDong>(
                  `${this.apiUrl}/api/Hoidongs/MaHD?MaHD=${id}`,
                  this.shareService.httpOptions
               )
               .toPromise()) ?? (response as HoiDong);
         return response;
      } catch (error) {
         console.error(error);
         throw error;
      }
   }

   async add(hoiDong: TL_HoiDongVT): Promise<any> {
      return await this.http
         .post(
            `${this.apiUrl}/api/Hoidongs`,
            hoiDong,
            this.shareService.httpOptions
         )
         .toPromise();
   }

   async update(hoidong: TL_HoiDongVT): Promise<any> {
      return await this.http
         .put<any>(
            `${this.apiUrl}/api/Hoidongs`,
            hoidong,
            this.shareService.httpOptions
         )
         .toPromise();
   }

   async updateAll(hoidong: TL_HoiDongVT): Promise<any> {
      return await this.http
         .put<any>(
            `${this.apiUrl}/api/Hoidongs`,
            hoidong,
            this.shareService.httpOptions
         )
         .toPromise();
   }

   async ListDetaiPhanBien(maBm: string): Promise<DeTai[]> {
      return (
         (await this.http
            .get<DeTai[]>(
               `${this.apiUrl}/api/Hoidongs/boMon?boMon=${maBm}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async ListDeTaiByHoiDongAsync(maHd: string): Promise<DeTai[]> {
      return (
         (await this.http
            .get<DeTai[]>(
               `${this.apiUrl}/api/Hoidongs/hoiDong?hoiDong=${maHd}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async delete(maHD: string): Promise<any> {
      return await this.http
         .delete(
            `${this.apiUrl}/api/Hoidongs/MaHD?MaHD=${maHD}`,
            this.shareService.httpOptions
         )
         .toPromise();
   }
}
