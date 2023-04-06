import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { dangKyService } from 'src/app/services/dangKy.service';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { DashboardComponent } from '../../dashboard.component';
import { giangVienService } from 'src/app/services/giangVien.service';

@Component({
  selector: 'app-dashboard-thanhviennhom',
  templateUrl: './dashboard-thanhviennhom.component.html',
  styleUrls: ['./dashboard-thanhviennhom.component.scss']
})
export class DashboardThanhviennhomComponent {
  lstGiangVien: GiangVien[] = [];
  lstStudent: SinhVien[] = [];
  lstThamGia: ThamGia[] = [];
  studentId: string = "";
  isConfirmDialogVisible = false;
  namHoc: string = "";
  dot: number = 1;
  leaderId = "";
  isTeamLeader = false;
  isTranferDialogVisible = false;
  tranferId = "";
  isGroupHaveOneMember = false;
  isSignUpDeTai = false;

  constructor(
    private shareService: shareService,
    private sinhVienService : sinhVienService,
    private thamGiaService : thamGiaService,
    private router: Router,
    private nhomService: nhomService,
    private loiMoiService: loiMoiService,
    private giangVienService: giangVienService,
  ) {}

  async ngOnInit(){
    this.namHoc = this.shareService.getNamHoc();
    this.dot = this.shareService.getDot();
    this.studentId = localStorage.getItem('Id')?.toString() + '';
    const groupJoinedId = await (await this.thamGiaService.getById(this.studentId, this.namHoc, this.dot)).maNhom;
    this.lstThamGia = (await this.thamGiaService.getAll()).filter(tg => tg.maNhom == groupJoinedId);
    this.lstThamGia.forEach(async thamGia => this.lstStudent.push(await this.sinhVienService.getById(thamGia.maSv)));
    this.leaderId = this.lstThamGia.filter(tgia => tgia.truongNhom === true)[0].maSv;
    this.isTeamLeader = this.studentId === this.leaderId;
    this.isGroupHaveOneMember = this.lstThamGia.length === 1;
    this.isSignUpDeTai = DashboardComponent.isSignUpDeTai;

    let lstMagv = DashboardComponent.maGvhd;
    if(this.isSignUpDeTai && lstMagv.length > 0){
      for(let i = 0 ; i < lstMagv.length ; i++){
        this.lstGiangVien.push(await this.giangVienService.getById(lstMagv[i]));
      }
    }
  }

  showConfirmDialog() {
    this.isConfirmDialogVisible = true;
  }

  hideConfirmDialog() {
    this.isConfirmDialogVisible = false;
  }

  async performAction() {
    this.isConfirmDialogVisible = false;
    if((this.isTeamLeader && this.isGroupHaveOneMember) || !this.isTeamLeader){
      let tgia = await this.thamGiaService.getById(this.studentId, this.namHoc, this.dot);
      if(this.isTeamLeader){
        //Xóa tất cả lời mời từ nhóm cũ
        const lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(tgia.maNhom, this.namHoc, this.dot);
        (await lstLoiMoi).forEach(lm => this.loiMoiService.delete(lm.maNhom, lm.maSv, lm.namHoc, lm.dot));
        //Xóa nhóm
        await this.nhomService.delete(tgia.maNhom);
      }
      
      //cập nhật lại tham gia
      tgia.maNhom = "";
      tgia.truongNhom = false;
      await this.thamGiaService.update(tgia);
      this.router.navigate(['dashboard']);
    }
  }

  showTranferDialog(maSv: string) {
    this.isTranferDialogVisible = true;
    this.tranferId = maSv;
  }

  hideTranferDialog() {
    this.isTranferDialogVisible = false;
  }

  async performTranferAction(){
    this.isTranferDialogVisible = false;
    const curGroupId = await (await this.thamGiaService.getById(this.studentId, this.namHoc, this.dot)).maNhom;
    let newGroupId = "";

    //tạo nhóm mới với nhóm trưởng mã tranferId
    var nhom = new Nhom();
    nhom.maNhom = this.tranferId + this.namHoc + this.dot;
    nhom.tenNhom = (await this.sinhVienService.getById(this.tranferId)).tenSv;
    newGroupId = nhom.maNhom;
    await this.nhomService.add(nhom);

    //Chỉnh sửa lại mã nhóm
    this.lstThamGia.forEach(async (thamGia:ThamGia) => {
      thamGia.maNhom = newGroupId;
      if(thamGia.maSv === this.tranferId){
        thamGia.truongNhom = true;
      }else{
        thamGia.truongNhom = false;
      }
      await this.thamGiaService.update(thamGia);
    });

    //Xóa tất cả lời mời từ nhóm cũ
    const lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(curGroupId, this.namHoc, this.dot);
    (await lstLoiMoi).forEach(lm => this.loiMoiService.delete(lm.maNhom, lm.maSv, lm.namHoc, lm.dot));
    //Xóa nhóm cũ
    await this.nhomService.delete(curGroupId);
    this.router.navigate(['dashboard/nhom']);
  }
}
