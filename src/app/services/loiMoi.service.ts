import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoiMoi } from '../models/LoiMoi.model';
import { shareService } from './../services/share.service';

@Injectable({
  providedIn: 'root',
})
export class loiMoiService {
  private apiUrl = environment.api;
  //private LoiMois!: BehaviorSubject<LoiMoi>;

  constructor(private http: HttpClient, private router: Router,
    private shareService: shareService) { }

  async getAll(): Promise<LoiMoi[]> {
    return await this.http.get<LoiMoi[]>(`${this.apiUrl}/api/Loimois`, this.shareService.httpOptions).toPromise() ?? [];
  }

  async add(LoiMoi: LoiMoi): Promise<any> {
    return await this.http.post(`${this.apiUrl}/api/Loimois`, 
    LoiMoi, this.shareService.httpOptions).toPromise();
  }

  async update(LoiMoi: LoiMoi): Promise<any> {
    return await this.http.put<any>(`${this.apiUrl}/api/Loimois/MaNhom, MaSV, NamHoc, Dot?MaNhom=${LoiMoi.maNhom}&MaSV=${LoiMoi.maSv}&NamHoc=${LoiMoi.namHoc}&Dot=${LoiMoi.dot}`, 
    LoiMoi, this.shareService.httpOptions).toPromise();
  }

  async delete(MaNhom: string, MaSV: string, NamHoc: string, Dot: number): Promise<any> {
    return await this.http.delete(`${this.apiUrl}/api/Loimois/MaNhom, MaSV, NamHoc, Dot?MaNhom=${MaNhom}&MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, 
    this.shareService.httpOptions).toPromise();
  }

  getById(MaNhom: string, MaSV: string, NamHoc: string, Dot: number):Observable<LoiMoi[]> {
    return this.http.get<LoiMoi[]>(`${this.apiUrl}/api/Khoas//MaNhom, MaSV, NamHoc, Dot?MaNhom=${MaNhom}&MaSV=${MaSV}&NamHoc=${NamHoc}&Dot=${Dot}`, this.shareService.httpOptions);
  }

  //Tạm thời
  async getAllLoiMoiSinhVienByIdDotNamHoc(MaSV: string, NamHoc: string, Dot: number): Promise<LoiMoi[]> {
    const lstLoiMoi = await this.http.get<LoiMoi[]>(`${this.apiUrl}/api/Loimois`, this.shareService.httpOptions).pipe(
      map(dsLoiMoi => dsLoiMoi.filter(lm => lm.maSv == MaSV && lm.namHoc == NamHoc && lm.dot == Dot)),
    ).toPromise();

    if(lstLoiMoi){
      return lstLoiMoi;
    }else {
      throw new Error('Invitation not found');
    }
  }
  //Tạm thời
  async getAllLoiMoiSinhVienByIdDotNamHocNhom(MaNhom: string, MaSV: string, NamHoc: string, Dot: number): Promise<LoiMoi[]> {
    const lstLoiMoi = await this.getAll();
    return lstLoiMoi.filter(lm => lm.maNhom == MaNhom && lm.maSv == MaSV && lm.namHoc == NamHoc && lm.dot == Dot);
  }

  //Tạm thời
  async getAllLoiMoiSinhVienByDotNamHocNhom(MaNhom: string, NamHoc: string, Dot: number): Promise<LoiMoi[]> {
    const lstLoiMoi = await this.getAll();
    return lstLoiMoi.filter(lm => lm.maNhom == MaNhom && lm.namHoc == NamHoc && lm.dot == Dot);
  }
}
