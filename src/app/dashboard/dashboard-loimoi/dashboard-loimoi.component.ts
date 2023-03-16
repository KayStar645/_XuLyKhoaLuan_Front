import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { Form } from 'src/assets/utils';
import { shareService } from '../../services/share.service';

@Component({
  selector: 'app-dashboard-loimoi',
  templateUrl: './dashboard-loimoi.component.html',
  styleUrls: ['./dashboard-loimoi.component.scss']
})
export class DashboardLoimoiComponent implements OnInit{
  public isFindedStudent$: Observable<boolean> = new Observable<boolean>();
  data = new SinhVien();
  MAX_IN_GROUP: number = 3;
  idSentStudent: any;
  groupIdCreated!: string;
  maxId: number = 0;
  lstNhom: Nhom[] = [];
  invitationForm: FormGroup;
  timSinhVienById: any;
  namHoc: string = '2020-2024';
  dot: number = 1;
  showSentToSelfError = false;
  showSuccessMessage = false;
  isSentToJoinedGroup = false;

  findSinhVienId = new Form({
    maSv: ['',Validators.required]
  });

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private sinhVienService: sinhVienService,
    private nhomService: nhomService,
    private thamGiaService: thamGiaService,
    private loiMoiService: loiMoiService,
    private route: ActivatedRoute,
    private shareService: shareService,
  ) {
    this.timSinhVienById = this.findSinhVienId.form;
    this.invitationForm = this.fb.group({
      namHoc: ['', Validators.required],
      dot: [1, Validators.required],
      loiNhan: ['Mời bạn tham gia vào nhóm của mình', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.idSentStudent = params.id);
    this.invitationForm.patchValue({namHoc: this.namHoc});
    this.invitationForm.patchValue({dot: this.dot});
  }

  // async findMaxGroupId(){
  //   this.lstNhom = await this.nhomService.getAll().toPromise()?? [];
  //   this.maxId = this.lstNhom.reduce((max, nhom) => {
  //     return nhom.maNhom > max ? nhom.maNhom : max;
  //   }, 0);
  // }

  async findSvById(event: any){
    this.showSentToSelfError = false;
    this.isSentToJoinedGroup = false;

    this.elementRef.nativeElement.querySelector('.result').style.display='block';
    try {
      this.data = await this.sinhVienService.getById(this.timSinhVienById.value['maSv']);
      this.elementRef.nativeElement.querySelector('.result-element').style.display = 'block';     
      this.elementRef.nativeElement.querySelector('.invitation-form').style.display = 'block';
      if(this.idSentStudent === this.data?.maSv){
        this.showSentToSelfError = true;  
      }
    } catch {
      
    }
    
    const isNotInAGroup = await this.checkNotJoinedGroup(this.data.maSv, this.namHoc, this.dot);
    if (!isNotInAGroup) {
      this.isSentToJoinedGroup = true;
      return;
    }
  }

  async sendInvitation(){
    await this.createLoiMoi();
  }

  async joinStudentIntoGroup(){
    var thamGia = await this.thamGiaService.getById(this.idSentStudent, this.namHoc, this.dot);
    if(thamGia != null) {
      thamGia.maNhom = this.groupIdCreated;

      try {
        await this.thamGiaService.update(thamGia);
        console.log("Thêm oke");
      } catch (error) {
        console.log("Không oke");
      }
    }    
  }

  async createLoiMoi(){
    if(this.invitationForm.valid){
      const loiMoi = new LoiMoi();
      const date = new Date();

      loiMoi.dot = parseInt(this.invitationForm.value['dot']);
      loiMoi.loiNhan = this.invitationForm.value['loiNhan'];
      //loiMoi.maNhom = await this.thamGiaService.getMaNhomBySinhVienId(this.idSentStudent, this.namHoc, this.dot);
      console.log(loiMoi.maNhom);
      loiMoi.maSv = this.data.maSv;
      loiMoi.namHoc = this.invitationForm.value['namHoc'];
      loiMoi.thoiGian = date.toISOString();
      loiMoi.trangThai = false;

      console.log(loiMoi);

      try {
        var result = await this.loiMoiService.add(loiMoi);
        console.log(result);
        this.showSuccessMessage = true;
      } catch (error) {
        console.log('Không oke rồi');
         console.log(error);
      }
    }
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

  async checkNotJoinedGroup(MaSV: string, NamHoc: string, Dot: number): Promise<Observable<boolean>> {
    try {
      var result = await this.thamGiaService.getById(MaSV, NamHoc, Dot);
      return of(true);
    } catch (error) {
      console.log('Error occurred:', error);
      return of(false);
    }
    // return this.thamGiaService.getById(MaSV, NamHoc, Dot).pipe(
    //   map((thamGia: ThamGia) => {
    //       return thamGia.maNhom === null;
    //   }),
    //   catchError((error: any) => {
    //     console.log('Error occurred:', error);
    //     return of(false);
    //   })
    // );
  }

  // //Dùng tạm
  // getMaNhomBySinhVienId(MaSV: string, NamHoc: string, Dot: number): Observable<number> {
  //   return this.thamGiaService.getById(MaSV, NamHoc, Dot).pipe(
  //     map((thamGia: ThamGia) => {
  //       return thamGia.maNhom;
  //     }),
  //     catchError((error: any) => {
  //       console.log('Error occurred:', error);
  //       return of(0);
  //     })
  //   );
  // }
}