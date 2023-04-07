import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  ) {
    this.timSinhVienById = this.findSinhVienId.form;
    this.invitationForm = this.fb.group({
      namHoc: ['', Validators.required],
      dot: [1, Validators.required],
      loiNhan: ['Mời bạn tham gia vào nhóm của mình', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.idSentStudent = DashboardComponent.maSV;
    this.invitationForm.patchValue({ namHoc: shareService.namHoc });
    this.invitationForm.patchValue({ dot: shareService.dot });
    console.log(shareService.namHoc, shareService.dot);
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
    if(DashboardComponent.isSignUpDeTai){
      this.isPopupVisible = true;
      return;
    }

    this.showSuccessMessage = false;
    this.showSentToSelfError = false;  
    this.showGroupMemberAlreadySent = false;
    const result = await this.checkNotJoinedGroup(this.idSentStudent, shareService.namHoc, shareService.dot);
    console.log(this.idSentStudent);
    if(result) {
      //Người gửi lời mời chưa từng tham gia vào nhóm nào
      await this.createGroup();
      await this.joinStudentIntoGroup();
    }else {
      this.groupIdCreated = await (await this.thamGiaService.getById(this.idSentStudent, shareService.namHoc, shareService.dot)).maNhom;
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
    let thamGia: ThamGia = await this.thamGiaService.getById(MaSV, NamHoc, Dot);
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