import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { Form } from 'src/assets/utils';
import { shareService } from '../../services/share.service';
import { DashboardComponent } from '../dashboard.component';
import { Router } from '@angular/router';

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
  showSentToSelfError = false;
  showSuccessMessage = false;
  showGroupMemberAlreadySent = false;
  isPopupVisible = false;
  isNotHaveStudent = false;
  isSignUpDeTai = false;
  isSentToNotJoinStudent = false;
  isSuccessPopup = false;

  findSinhVienId = new Form({
    maSv: ['',Validators.required]
  });

  constructor(
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private sinhVienService: sinhVienService,
    private nhomService: nhomService,
    private thamGiaService: thamGiaService,
    private loiMoiService: loiMoiService,
    private shareService: shareService,
    private router: Router,
  ) {
    this.timSinhVienById = this.findSinhVienId.form;
    this.invitationForm = this.fb.group({
      namHoc: ['', Validators.required],
      dot: [1, Validators.required],
      loiNhan: ['Mời bạn tham gia vào nhóm của mình', Validators.required],
    });
  }

  public async ngOnInit(){
    this.idSentStudent = DashboardComponent.maSV;
    this.invitationForm.patchValue({ namHoc: shareService.namHoc });
    this.invitationForm.patchValue({ dot: shareService.dot });

    //Nếu không có trong tham gia không được mời quay trở lại trang chủ
    if(await this.thamGiaService.isJoinedAGroup(DashboardComponent.maSV, shareService.namHoc, shareService.dot) == false){
      this.router.navigate(['dashboard']);
    }
  }

  async findSvById(event: any){
    this.showSuccessMessage = false;
    this.isNotHaveStudent = false;
    this.isSignUpDeTai = false;
    this.isPopupVisible = false;
    this.isSentToNotJoinStudent = false;
    this.showSentToSelfError = false;  

    if(await this.sinhVienService.isHaveThisStudent(this.timSinhVienById.value['maSv']) == false){
      this.isPopupVisible = true;
      this.isNotHaveStudent = true;
      return;
    }
    this.showGroupMemberAlreadySent = false;
    
    this.elementRef.nativeElement.querySelector('.result').style.display='block';
    this.data = await this.sinhVienService.getById(this.timSinhVienById.value['maSv']);
    this.elementRef.nativeElement.querySelector('.result-element').style.display = 'block';
    if(this.idSentStudent === this.data?.maSv){
      this.isPopupVisible = true;
      this.showSentToSelfError = true;  
    }
  }

  async sendInvitation(){
    this.isNotHaveStudent = false;
    this.isSignUpDeTai = false;
    this.isPopupVisible = false;
    this.isSentToNotJoinStudent = false;
    this.showSuccessMessage = false;
    this.showSentToSelfError = false;  
    this.showGroupMemberAlreadySent = false;

    //Xuất ra lỗi khi nhóm đã đăng ký đề tài
    if(DashboardComponent.isSignUpDeTai){
      this.isSignUpDeTai = true;
      this.isPopupVisible = true;
      return;
    }

    //Xuất ra lỗi khi gửi lời mời cho sinh viên không trong đợt đăng ký khóa luận
    if(await this.thamGiaService.isJoinedAGroup(this.timSinhVienById.value['maSv'], this.namHoc, this.dot) == false){
      this.isPopupVisible = true;
      this.isSentToNotJoinStudent = true;
      return;
    }

    const result = await this.checkNotJoinedGroup(this.idSentStudent, this.namHoc, this.dot);
    if(result) {
      //Người gửi lời mời chưa từng tham gia vào nhóm nào
      await this.createGroup();
      await this.joinStudentIntoGroup();
    }else {
      this.groupIdCreated = await (await this.thamGiaService.getById(this.idSentStudent, shareService.namHoc, shareService.dot)).maNhom;
    }
    
    if(await this.checkGroupMemberSentInvitation()){
      this.isPopupVisible = true;
      this.showGroupMemberAlreadySent = true;
      return;
    }else{
      await this.createLoiMoi();
      this.showSuccessMessage = true;
      this.isPopupVisible = true;
    }
  }

  async createGroup(){
    var nhom = new Nhom();
    nhom.maNhom = this.idSentStudent + shareService.namHoc + shareService.dot;
    nhom.tenNhom = (await this.sinhVienService.getById(this.idSentStudent)).tenSv;
    this.groupIdCreated = nhom.maNhom;

    this.nhomService.add(nhom);
  }

  async joinStudentIntoGroup(){
    var thamGia = await this.thamGiaService.getById(this.idSentStudent, shareService.namHoc, shareService.dot);
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
      loiMoi.maSv = this.data.maSv;
      loiMoi.namHoc = this.invitationForm.value['namHoc'];
      loiMoi.thoiGian = date.toISOString();
      loiMoi.trangThai = false;

      await this.loiMoiService.add(loiMoi);
    }
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

  async checkNotJoinedGroup(MaSV: string, NamHoc: string, Dot: number): Promise<boolean> {
    let thamGia: ThamGia = await this.thamGiaService.getById(MaSV, NamHoc, Dot);
    console.log(thamGia);
    return thamGia.maNhom === null || thamGia.maNhom === '';
  }

  async checkGroupMemberSentInvitation(){
    let lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHocNhom(this.groupIdCreated, this.data.maSv, shareService.namHoc, shareService.dot);
    if(lstLoiMoi.length > 0){
      return true;
    }
    return false;
  }

  hidePopup(){
    this.isPopupVisible = false;
  }
}