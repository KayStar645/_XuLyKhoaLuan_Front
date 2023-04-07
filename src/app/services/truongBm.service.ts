import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { TruongBm } from '../models/TruongBm.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class truongBmService {
  private apiUrl = environment.api;
  //private truongBms!: BehaviorSubject<TruongBm>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<TruongBm[]> {
    return (
      (await this.http
        .get<TruongBm[]>(
          `${this.apiUrl}/api/Truongbms`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(maTbm: number): Promise<TruongBm> {
    var response = new TruongBm();
    return (
      (await this.http
        .get<TruongBm>(
          `${this.apiUrl}/api/Truongbms/maTbm?maTbm=${maTbm}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? response
    );
  }

  async CheckTruongBomonByMaGV(MaGV: string): Promise<TruongBm> {
    var response = new TruongBm();
    return (
      (await this.http
        .get<TruongBm>(
          `${this.apiUrl}/api/Truongbms/MaGV?MaGV=${MaGV}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? response
    );
  }

  async isTruongBomonByMaGV(MaGV: string): Promise<Boolean> {
    return (
      (await this.http
        .get<Boolean>(
          `${this.apiUrl}/api/Truongbms/isMaGV?isMaGV=${MaGV}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? false
    );
  }

  async add(TruongBm: TruongBm): Promise<any> {
    return await this.http
      .post(
        `${this.apiUrl}/api/Truongbms`,
        TruongBm,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async update(TruongBm: TruongBm): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Truongbms/maTbm?maTbm=${TruongBm.maTbm}`,
        TruongBm,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(maTbm: number): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Truongbms/maTbm?maTbm=${maTbm}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }
}
