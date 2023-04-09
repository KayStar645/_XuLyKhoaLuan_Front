import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PhanBien } from '../models/PhanBien.model';
import { shareService } from './../services/share.service';
import { GiangVien } from '../models/GiangVien.model';

@Injectable({
  providedIn: 'root',
})
export class phanBienService {
  private apiUrl = environment.api;
  //private phanBiens!: BehaviorSubject<PhanBien>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<PhanBien[]> {
    return (
      (await this.http
        .get<PhanBien[]>(
          `${this.apiUrl}/api/Phanbiens`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getGiangvienByDetai(maDT: string): Promise<GiangVien[]> {
    return (
      (await this.http
        .get<GiangVien[]>(
          `${this.apiUrl}/api/Phanbiens/maDT?maDT=${maDT}`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(MaGV: string, MaDT: string): Promise<PhanBien> {
    try {
      var response = new PhanBien();
      response =
        (await this.http
          .get<PhanBien>(
            `${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as PhanBien);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async add(phanBien: PhanBien): Promise<any> {
    return await this.http
      .post(
        `${this.apiUrl}/api/Phanbiens`,
        phanBien,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async update(phanBien: PhanBien): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${phanBien.maGv}&MaDT=${phanBien.maDt}`,
        phanBien,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(MaGV: string, MaDT: string): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Phanbiens/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }
}
