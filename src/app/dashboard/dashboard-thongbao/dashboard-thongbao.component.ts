import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { DashboardComponent } from '../dashboard.component';
import { DashboardDanhsachthongbaoComponent } from './dashboard-danhsachthongbao/dashboard-danhsachthongbao.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-thongbao',
  templateUrl: './dashboard-thongbao.component.html',
  styleUrls: ['./dashboard-thongbao.component.scss'],
})
export class DashboardThongbaoComponent {
  title = 'Thông báo';
  maSv: string = '';
  lstLoiMoi: LoiMoi[] = [];
  isAccept = false;
  isConfirmDialogVisible = false;
  loiMoi: any;
  isTeamLeader = false;
  isGroupHaveOneMember = false;
  isPopupVisible = false;

  // Hiển thị thông báo của khoa nè
  @ViewChild(DashboardDanhsachthongbaoComponent)
  protected DSTBComponent!: DashboardDanhsachthongbaoComponent;

  constructor(
    private router: Router,
    private shareService: shareService,
    private loiMoiService: loiMoiService,
    private thamGiaService: thamGiaService,
    private cd: ChangeDetectorRef,
    private nhomService: nhomService,
    private titleService: Title
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách thông báo');
  }

  async acceptInvitation(loiMoi: LoiMoi) {
    if (DashboardComponent.isSignUpDeTai) {
      this.isPopupVisible = true;
      return;
    }

    let groupIdCreated = await (
      await this.thamGiaService.getById(
        this.maSv,
        shareService.namHoc,
        shareService.dot
      )
    ).maNhom;
    var thamGia = await this.thamGiaService.getById(
      loiMoi.maSv,
      shareService.namHoc,
      shareService.dot
    );
    if (groupIdCreated !== null && groupIdCreated !== '') {
      this.isConfirmDialogVisible = true;
      this.isTeamLeader = thamGia.truongNhom;
      this.loiMoi = loiMoi;
    } else {
      thamGia.maNhom = loiMoi.maNhom;
      thamGia.truongNhom = false;
      this.thamGiaService.update(thamGia);
      await this.loiMoiService.delete(
        this.loiMoi.maNhom,
        this.loiMoi.maSv,
        this.loiMoi.namHoc,
        this.loiMoi.dot
      );
      this.lstLoiMoi =
        await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(
          this.maSv,
          shareService.namHoc,
          shareService.dot
        );
      this.cd.detectChanges();
    }
  }

  //Phải click 2 lần mới cập nhật được phần đã xóa
  async rejectInvitation(loiMoi: LoiMoi) {
    await this.loiMoiService.delete(
      loiMoi.maNhom,
      loiMoi.maSv,
      loiMoi.namHoc,
      loiMoi.dot
    );
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(
      this.maSv,
      shareService.namHoc,
      shareService.dot
    );
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
    var thamGia = await this.thamGiaService.getById(
      this.loiMoi.maSv,
      shareService.namHoc,
      shareService.dot
    );
    if (thamGia.truongNhom && !this.isGroupHaveOneMember) {
      this.router.navigate(['dashboard/nhom/thanh-vien']);
      return;
    } else if (thamGia.truongNhom && this.isGroupHaveOneMember) {
      let tgia = await this.thamGiaService.getById(
        this.maSv,
        shareService.namHoc,
        shareService.dot
      );
      //Xóa tất cả lời mời từ nhóm cũ
      const lstLoiMoi =
        await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(
          tgia.maNhom,
          shareService.namHoc,
          shareService.dot
        );
      (await lstLoiMoi).forEach((lm) =>
        this.loiMoiService.delete(lm.maNhom, lm.maSv, lm.namHoc, lm.dot)
      );
      //Xóa nhóm
      await this.nhomService.delete(tgia.maNhom);
    }
    thamGia.maNhom = this.loiMoi.maNhom;
    thamGia.truongNhom = false;
    await this.thamGiaService.update(thamGia);

    //Cập nhật lại danh sách lời mời
    await this.loiMoiService.delete(
      this.loiMoi.maNhom,
      this.loiMoi.maSv,
      this.loiMoi.namHoc,
      this.loiMoi.dot
    );
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(
      this.maSv,
      shareService.namHoc,
      shareService.dot
    );
    this.cd.detectChanges();
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  // Hiển thị thông báo của khoa nè
}
