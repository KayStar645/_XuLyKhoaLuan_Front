import { khoaService } from './../../services/khoa.service';
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
import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  providers: [HomeMainComponent]
})
export class HomeMainComponent {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = GiangVien;
  maBm!: string;
  maKhoa!: string;
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
    private el: ElementRef,
  ) {}

  public async ngOnInit() {
    this.titleService.setTitle('Quản lý');
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

    try {
      this.maBm = await (await this.truongBmService.CheckTruongBomonByMaGV(this.maGV)).maBm;
    } catch { }
    try {
      this.maKhoa = await (await this.truongKhoaService.CheckTruongKhoaByMaGV(this.maGV)).maKhoa;
    } catch { }

    // Nếu có chức vụ hoặc tham gia hội đồng thì giảm item xuống và css lại
    this.resetNavbar();
  }

  resetNavbar() {
    var navbar = this.el.nativeElement.querySelector('#navbar');
    var number = navbar.querySelectorAll('li').length;

    var navbar_items = this.el.nativeElement.querySelectorAll('.navbar-item');
    navbar_items.forEach((item: { style: { flexBasis: string; }; }) => {
      item.style.flexBasis = 'calc(100% / '+ number +')';
    });    
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

}
