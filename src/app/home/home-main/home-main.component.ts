import { HoiDong } from './../../models/HoiDong.model';
import { hoiDongService } from './../../services/hoiDong.service';
import { boMonService } from './../../services/boMon.service';
import { TruongBm } from './../../models/TruongBm.model';
import { TruongKhoa } from './../../models/TruongKhoa.model';
import { truongBmService } from './../../services/truongBm.service';
import { truongKhoaService } from './../../services/truongKhoa.service';
import { shareService } from './../../services/share.service';
import { giangVienService } from './../../services/giangVien.service';
import { GiangVien } from './../../models/GiangVien.model';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss']
})
export class HomeMainComponent {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = GiangVien;
  truongKhoa: any = TruongKhoa;
  truongBm: any = TruongBm;
  hoiDong: any = HoiDong;
  itemNumber = 9;

  countTB = 0;
  countKH = 0;
  boMon = "";
  maGV = '' + localStorage.getItem('Id')?.toString();

  constructor(
    private authService: AuthService,
    private router: Router,
    private giangVienService: giangVienService,
    private titleService: Title,
    private shareService: shareService,
    private truongKhoaService: truongKhoaService,
    private truongBmService: truongBmService,
    private boMonService: boMonService,
    private hoiDongService: hoiDongService,
  ) {}

  public async ngOnInit() {
    this.titleService.setTitle('Quản lý');
    // Nếu có chức vụ hoặc tham gia hội đồng thì giảm item xuống và css lại

    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Teacher')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của giáo viên
    this.data = await this.giangVienService.getById(this.maGV);
    this.boMon = (await this.boMonService.getById(this.data.maBm)).tenBm;

    // Lấy chức vụ trưởng khoa
    try {
      this.truongKhoa = await this.truongKhoaService.getByMaGV(this.maGV);  
    } catch (error) {
     console.log(error); 
    }

    // Lấy chức vụ trưởng bộ môn
    try {
      this.truongBm = await this.truongBmService.getByMaGv(this.maGV);  
    } catch (error) {
     console.log(error); 
    }
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

}
