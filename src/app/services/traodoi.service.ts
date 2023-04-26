import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { shareService } from './share.service';
import { Traodoi } from '../models/VirtualModel/TraodoiModel';

@Injectable({
  providedIn: 'root',
})
export class traoDoiService {
  private apiUrl = environment.api;
  //private thongBaos!: BehaviorSubject<ThongBao>;

  constructor(private http: HttpClient, private shareService: shareService) {}

  async GetAllTraoDoiMotCongViec(maCv: string): Promise<Traodoi[]> {
    return (
      (await this.http
        .get<Traodoi[]>(
          `${this.apiUrl}/api/Traodoi/maCv?maCv=${maCv}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }
}
