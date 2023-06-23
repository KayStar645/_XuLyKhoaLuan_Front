import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareService } from '../share.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';
import { DiemSVVT } from 'src/app/models/VirtualModel/DiemSVVTModel';

@Injectable({
   providedIn: 'root',
})
export class deTaiDiemService {
   private apiUrl = environment.api;

   constructor(private http: HttpClient, private shareService: shareService) {}

   async GetDanhSachDiemByGv(maGv: string, namHoc: string, dot: number): Promise<DeTaiDiemVT[]> {
      return (
         (await this.http
            .get<DeTaiDiemVT[]>(
               `${this.apiUrl}/api/DeTaiDiem/maGv,namHoc,dot?maGv=${maGv}&namHoc=${namHoc}&dot=${dot}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async GetDanhSachDiemBySv(maSv: string): Promise<DeTaiDiemVT[]> {
      return (
         (await this.http
            .get<DeTaiDiemVT[]>(
               `${this.apiUrl}/api/DeTaiDiem/maSv?maSv=${maSv}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }

   async ChamDiemSv(
      maGv: string,
      maDt: string,
      maSv: string,
      namHoc: string,
      dot: number,
      vaiTro: number,
      diem: number
   ): Promise<boolean> {
      return (
         (await this.http
            .put<boolean>(
               `${this.apiUrl}/api/DeTaiDiem/maGv,maDt,maSv,namHoc,dot,vaiTro,diem?maGv=${maGv}&maDt=${maDt}&maSv=${maSv}&namHoc=${namHoc}&dot=${dot}&vaiTro=${vaiTro}&diem=${diem}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? false
      );
   }

   async GetDanhSachDiem(
      keyword: string,
      maCn: string,
      namHoc: string,
      dot: number
   ): Promise<DiemSVVT[]> {
      return (
         (await this.http
            .get<DiemSVVT[]>(
               `${this.apiUrl}/api/DeTaiDiem/keyword,maCn,namHoc,dot?keyword=${keyword}&maCn=${maCn}&namHoc=${namHoc}&dot=${dot}`,
               this.shareService.httpOptions
            )
            .toPromise()) ?? []
      );
   }
}
