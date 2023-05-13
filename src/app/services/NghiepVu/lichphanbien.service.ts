import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareService } from '../share.service';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { DeTai } from 'src/app/models/DeTai.model';

@Injectable({
  providedIn: 'root',
})
export class lichPhanBienService {
  private apiUrl = environment.api;
  //private thongBaos!: BehaviorSubject<ThongBao>;

  constructor(private http: HttpClient, private shareService: shareService) {}

  async GetLichPhanBienByGvAsync(maGv: string): Promise<LichPhanBien[]> {
    return (
      (await this.http
        .get<LichPhanBien[]>(
          `${this.apiUrl}/api/LichPhanBien/maGv?maGv=${maGv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetLichPhanBienBySvAsync(maSv: string): Promise<LichPhanBien[]> {
    return (
      (await this.http
        .get<LichPhanBien[]>(
          `${this.apiUrl}/api/LichPhanBien/maSv?maSv=${maSv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async GetSelectDetaiByGiangVien(maGv: string, namHoc: string, dot: number, loaiLich: number): Promise<DeTai[]> {
    return (
      (await this.http
        .get<DeTai[]>(
          `${this.apiUrl}/api/LichPhanBien/maGv,namHoc,dot,loaiLich?maGv=${maGv}&namHoc=${namHoc}&dot=${dot}&loaiLich=${loaiLich}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }
}
