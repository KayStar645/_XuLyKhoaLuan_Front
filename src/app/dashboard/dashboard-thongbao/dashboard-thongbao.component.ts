import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { thongBaoService } from 'src/app/services/thongBao.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private shareService: shareService,
    private loiMoiService : loiMoiService,
    private thamGiaService : thamGiaService,
    private cd: ChangeDetectorRef,
  ) {}

  async ngOnInit(){
    this.route.params.subscribe(params => {
      this.maSv = params['id']
    })
    this.namHoc = this.shareService.getNamHoc();
    this.dot = this.shareService.getDot();
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
  }

  async acceptInvitation(loiMoi: LoiMoi){
    let groupIdCreated = await (await this.thamGiaService.getById(this.maSv, this.namHoc, this.dot)).maNhom;
    var thamGia = await this.thamGiaService.getById(loiMoi.maSv, this.namHoc, this.dot);
    if(groupIdCreated !== null){
      const confirmed = confirm('Bạn đang trong một nhóm, Nhấn "OK" để thoát nhóm cũ và tham gia vào nhóm mới');
      if(confirmed){
        thamGia.maNhom = loiMoi.maNhom;
        thamGia.truongNhom = false;
        this.thamGiaService.update(thamGia);
      }
    }else{
      thamGia.maNhom = loiMoi.maNhom;
      thamGia.truongNhom = false;
      this.thamGiaService.update(thamGia);
    }

    await this.loiMoiService.delete(loiMoi.maNhom,loiMoi.maSv,loiMoi.namHoc,loiMoi.dot);
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
    this.cd.detectChanges(); 
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

  async confirm(){
    
  }
}