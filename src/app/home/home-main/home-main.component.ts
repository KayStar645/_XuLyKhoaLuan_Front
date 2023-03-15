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

  public ngOnInit(): void {
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
    this.giangVienService
      .getById(this.maGV)
      .subscribe((data) => {
        this.data = data;
        this.boMonService.getById(data.maBm).subscribe(data => this.boMon = data.tenBm);
        // Test nè nha
        this.itemNumber -= 4;
        
      });

    // Lấy chức vụ trưởng khoa
    this.truongKhoaService.getByMaGV(this.maGV)
      .subscribe((data) => {
        if(data.ngayNghi == null) {
          this.truongKhoa = data;
        }
      });

    // Lấy chức vụ trưởng bộ môn
    this.truongBmService.getByMaGv(this.maGV)
      .subscribe((data) => {
        if(data.ngayNghi == null) {
          this.truongBm = data;
        }
      });
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

}
