import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { PbCham } from '../models/PbCham.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class pbChamService {
  private apiUrl = environment.api;
  //private PbChams!: BehaviorSubject<PbCham>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private shareService: shareService
  ) {}

  async getAll(): Promise<PbCham[]> {
    return (
      (await this.http
        .get<PbCham[]>(
          `${this.apiUrl}/api/Pbchams`,
          this.shareService.httpOptions
        )
        .toPromise()) ?? []
    );
  }

  async getById(MaGV: string, MaDT: string): Promise<PbCham> {
    try {
      var response = new PbCham();
      response =
        (await this.http
          .get<PbCham>(
            `${this.apiUrl}/api/Pbchams/MaGV, MaDT?MaGV=${MaGV}&MaDT=${MaDT}`,
            this.shareService.httpOptions
          )
          .toPromise()) ?? (response as PbCham);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async add(PbCham: PbCham): Promise<any> {
    return await this.http
      .post(`${this.apiUrl}/api/Pbchams`, PbCham, this.shareService.httpOptions)
      .toPromise();
  }

  async update(PbCham: PbCham): Promise<any> {
    return await this.http
      .put<any>(
        `${this.apiUrl}/api/Pbchams/MaGV, MaDT?MaGV=${PbCham.maGv}&MaDT=${PbCham.maDt}`,
        PbCham,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async delete(
    MaGV: string,
    MaDT: string,
    maSv: string,
    namHoc: string,
    dot: number
  ): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Pbchams/MaGV, MaDT, maSv, namHoc, dot?MaGV=${MaGV}&MaDT=${MaDT}&maSv=${maSv}&namHoc=${namHoc}&dot=${dot}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }

  async DeletePbchamsByGvDt(
    MaGV: string,
    MaDT: string,
    namHoc: string,
    dot: number
  ): Promise<any> {
    return await this.http
      .delete(
        `${this.apiUrl}/api/Pbchams/MaGV, MaDT, namHoc, dot?MaGV=${MaGV}&MaDT=${MaDT}&namHoc=${namHoc}&dot=${dot}`,
        this.shareService.httpOptions
      )
      .toPromise();
  }
}
