import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-dashboard-thongbao',
  templateUrl: './dashboard-thongbao.component.html',
  styleUrls: ['./dashboard-thongbao.component.scss']
})


export class DashboardThongbaoComponent {
  title = 'Thông báo';
  maSv: string = '';
  lstLoiMoi: LoiMoi[] = [];
  namHoc: string = "";
  dot: number = 1;
  isAccept = false;
  isConfirmDialogVisible = false;
  loiMoi: any;
  isTeamLeader = false;
  isGroupHaveOneMember = false;
  isPopupVisible = false;

  constructor(
    private router: Router,
    private shareService: shareService,
    private loiMoiService : loiMoiService,
    private thamGiaService : thamGiaService,
    private cd: ChangeDetectorRef,
    private nhomService: nhomService,
  ) {}

  async ngOnInit(){
    this.maSv = DashboardComponent.maSV;
    this.namHoc = this.shareService.getNamHoc();
    this.dot = this.shareService.getDot();
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
    const groupJoinedId = await (await this.thamGiaService.getById(this.maSv, this.namHoc, this.dot)).maNhom;
    this.isGroupHaveOneMember = (await this.thamGiaService.getAll()).filter(tg => tg.maNhom == groupJoinedId).length === 1;
  }

  async acceptInvitation(loiMoi: LoiMoi){
    if(DashboardComponent.isSignUpDeTai){
      this.isPopupVisible = true;
      return;
    }

    let groupIdCreated = await (await this.thamGiaService.getById(this.maSv, this.namHoc, this.dot)).maNhom;
    var thamGia = await this.thamGiaService.getById(loiMoi.maSv, this.namHoc, this.dot);
    if(groupIdCreated !== null && groupIdCreated !== ''){
      this.isConfirmDialogVisible = true;
      this.isTeamLeader = thamGia.truongNhom;
      this.loiMoi = loiMoi;
    }else{
      thamGia.maNhom = loiMoi.maNhom;
      thamGia.truongNhom = false;
      this.thamGiaService.update(thamGia);
      await this.loiMoiService.delete(this.loiMoi.maNhom,this.loiMoi.maSv,this.loiMoi.namHoc,this.loiMoi.dot);
      this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
      this.cd.detectChanges();
    }
  }

  //Phải click 2 lần mới cập nhật được phần đã xóa
  async rejectInvitation(loiMoi: LoiMoi){
    await this.loiMoiService.delete(loiMoi.maNhom,loiMoi.maSv,loiMoi.namHoc,loiMoi.dot);
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
    this.cd.detectChanges(); 
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

  async showConfirmDialog() {
    this.isConfirmDialogVisible = true;
  }

  hideConfirmDialog() {
    this.isConfirmDialogVisible = false;
  }

  async performAction() {
    this.isConfirmDialogVisible = false;
    var thamGia = await this.thamGiaService.getById(this.loiMoi.maSv, this.namHoc, this.dot);
    if(thamGia.truongNhom && !this.isGroupHaveOneMember){
      this.router.navigate(['dashboard/nhom/thanh-vien']);
      return;
    }else if(thamGia.truongNhom && this.isGroupHaveOneMember){
      let tgia = await this.thamGiaService.getById(this.maSv, this.namHoc, this.dot);
      //Xóa tất cả lời mời từ nhóm cũ
      const lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(tgia.maNhom, this.namHoc, this.dot);
      (await lstLoiMoi).forEach(lm => this.loiMoiService.delete(lm.maNhom, lm.maSv, lm.namHoc, lm.dot));
      //Xóa nhóm
      await this.nhomService.delete(tgia.maNhom);
    }
    thamGia.maNhom = this.loiMoi.maNhom;
    thamGia.truongNhom = false;
    await this.thamGiaService.update(thamGia);
    
    //Cập nhật lại danh sách lời mời
    await this.loiMoiService.delete(this.loiMoi.maNhom,this.loiMoi.maSv,this.loiMoi.namHoc,this.loiMoi.dot);
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
    this.cd.detectChanges();
  }

  hidePopup(){
    this.isPopupVisible = false;
  }
}