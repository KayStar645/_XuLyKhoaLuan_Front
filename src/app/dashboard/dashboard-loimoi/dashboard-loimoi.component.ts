import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { Nhom } from 'src/app/models/Nhom.model';
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
  data: any;
  MAX_IN_GROUP: number = 3;
  idSentStudent: any;
  groupIdCreated: string = ''!;
  maxId: number = 0;
  lstNhom: Nhom[] = [];
  invitationForm: FormGroup;
  timSinhVienById: any;
  @Input() namHoc: string = "";
  @Input() dot: number = 1;
  showSentToSelfError = false;
  showSuccessMessage = false;
  showGroupMemberAlreadySent = false;

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
    this.route.queryParams.subscribe(params => {
      this.idSentStudent = params['id'];
    });
    this.namHoc = this.shareService.getNamHoc();
    this.dot = this.shareService.getDot();
    this.invitationForm.patchValue({namHoc: this.namHoc});
    this.invitationForm.patchValue({dot: this.dot});
    console.log(this.namHoc, this.dot);
  }

  async findSvById(event: any){
    this.showSuccessMessage = false;
    this.showSentToSelfError = false;  
    this.showGroupMemberAlreadySent = false;
    
    this.elementRef.nativeElement.querySelector('.result').style.display='block';
    this.data = await this.sinhVienService.getById(this.timSinhVienById.value['maSv']);
    if(this.data == null)
      console.log("Không tồn tại sinh viên");
    else{
      this.elementRef.nativeElement.querySelector('.result-element').style.display = 'block';     
      this.elementRef.nativeElement.querySelector('.invitation-form').style.display = 'block';
      if(this.idSentStudent === this.data?.maSv){
        this.showSentToSelfError = true;  
      }
    }
  }

  async sendInvitation(){
    this.showSuccessMessage = false;
    this.showSentToSelfError = false;  
    this.showGroupMemberAlreadySent = false;
    const result = await this.checkNotJoinedGroup(this.idSentStudent, this.namHoc, this.dot);
    console.log(this.idSentStudent);
    if(result) {
      //Người gửi lời mời chưa từng tham gia vào nhóm nào
      await this.createGroup();
      await this.joinStudentIntoGroup();
    }else {
      this.groupIdCreated = await (await this.thamGiaService.getById(this.idSentStudent, this.namHoc, this.dot)).maNhom;
    }
    
    console.log(await this.checkGroupMemberSentInvitation());
    if(await this.checkGroupMemberSentInvitation()){
      console.log(await this.checkGroupMemberSentInvitation());
      this.showGroupMemberAlreadySent = true;
    }else{
      await this.createLoiMoi();
      this.showSuccessMessage = true;
    }
  }

  async createGroup(){
    var nhom = new Nhom();
    nhom.maNhom = this.idSentStudent + this.namHoc + this.dot;
    nhom.tenNhom = (await this.sinhVienService.getById(this.idSentStudent)).tenSv;
    this.groupIdCreated = nhom.maNhom;

    this.nhomService.add(nhom);
  }

  async joinStudentIntoGroup(){
    var thamGia = await this.thamGiaService.getById(this.idSentStudent, this.namHoc, this.dot);
    thamGia.maNhom = this.groupIdCreated;
    thamGia.truongNhom = true;

    this.thamGiaService.update(thamGia);
  }

  async createLoiMoi(){
    if(this.invitationForm.valid){
      const loiMoi = new LoiMoi();
      const date = new Date();

      loiMoi.dot = parseInt(this.invitationForm.value['dot']);
      loiMoi.loiNhan = this.invitationForm.value['loiNhan'];
      loiMoi.maNhom = this.groupIdCreated;
      console.log(loiMoi.maNhom);
      loiMoi.maSv = this.data.maSv;
      loiMoi.namHoc = this.invitationForm.value['namHoc'];
      loiMoi.thoiGian = date.toISOString();
      loiMoi.trangThai = false;

      console.log(loiMoi);

      await this.loiMoiService.add(loiMoi);
    }
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

  async checkNotJoinedGroup(MaSV: string, NamHoc: string, Dot: number): Promise<boolean> {
    let thamGia: ThamGia = await  this.thamGiaService.getById(MaSV, NamHoc, Dot);
    return thamGia !== null;
  }

  async checkGroupMemberSentInvitation(){
    let lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHocNhom(this.groupIdCreated, this.data.maSv, this.namHoc, this.dot);
    if(lstLoiMoi.length > 0){
      return true;
    }
    return false;
  }
}