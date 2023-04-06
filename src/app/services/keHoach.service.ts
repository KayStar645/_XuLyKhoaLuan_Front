import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { KeHoach } from '../models/KeHoach.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class keHoachService {
  private apiUrl = environment.api;
  //private keHoachs!: BehaviorSubject<KeHoach>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<KeHoach[]> {
    return (
      (await this.http
        .get<KeHoach[]>(
          `${this.apiUrl}/api/Kehoaches`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getKeHoachByMaKhoa(maKhoa: string): Promise<KeHoach[]> {
    return (
      (await this.http
        .get<KeHoach[]>(
          `${this.apiUrl}/api/Kehoaches/maKhoa?maKhoa=${maKhoa}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getKeHoachByMaBM(maBM: string): Promise<KeHoach[]> {
    return (
      (await this.http
        .get<KeHoach[]>(
          `${this.apiUrl}/api/Kehoaches/maBM?maBM=${maBM}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(MaKH: number): Promise<KeHoach> {
    try {
      var response = new KeHoach();
      response =
        (await this.http
          .get<KeHoach>(
            `${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${MaKH}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as KeHoach);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async add(keHoach: KeHoach): Promise<any> {
    return await this.http
      .post(
        `${this.apiUrl}/api/Kehoaches`,
        keHoach,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async update(keHoach: KeHoach): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${keHoach.maKh}`,
        keHoach,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(MaKH: number): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Kehoaches/MaKH?MaKH=${MaKH}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }
}
