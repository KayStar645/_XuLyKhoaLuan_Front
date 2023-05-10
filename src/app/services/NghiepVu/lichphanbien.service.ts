import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareService } from '../share.service';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';

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
          `${this.apiUrl}/api/LichPhanBien/maGv?maSv=${maSv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }
}
