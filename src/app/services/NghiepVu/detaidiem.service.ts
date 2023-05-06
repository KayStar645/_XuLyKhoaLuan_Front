import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareService } from '../share.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';

@Injectable({
  providedIn: 'root',
})
export class deTaiDiemService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient, private shareService: shareService) {}

  async GetDanhSachDiemByGv(maGv: string): Promise<DeTaiDiemVT[]> {
    return (
      (await this.http
        .get<DeTaiDiemVT[]>(
          `${this.apiUrl}/api/DeTaiDiem/maGv?maGv=${maGv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }
}
