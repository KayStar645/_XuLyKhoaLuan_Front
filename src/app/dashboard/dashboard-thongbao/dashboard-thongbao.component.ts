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
  namHoc = '2020-2024'; //tạm gán cứng
  dot = 1; //tạm gán cứng
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
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
  }

  async acceptInvitation(loiMoi: LoiMoi){
    var thamGia = await this.thamGiaService.getById(loiMoi.maSv, this.namHoc, this.dot).toPromise();
    thamGia.maNhom = loiMoi.maNhom;

    this.thamGiaService.update(thamGia).subscribe(
      (sucess) => {this.isAccept = true; this.cd.detectChanges(); console.log(sucess)},
      (error) => {console.log('Không oke rồi'); console.log(error);}
    );
  }

  //Phải click 2 lần mới cập nhật được phần đã xóa
  async rejectInvitation(loiMoi: LoiMoi){
    await this.loiMoiService.delete(loiMoi.maNhom,loiMoi.maSv,loiMoi.namHoc,loiMoi.dot).subscribe(
      data => console.log(data)
    );
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(this.maSv,this.namHoc,this.dot);
    this.cd.detectChanges(); 
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
