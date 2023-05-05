import { phanBienService } from 'src/app/services/phanBien.service';
import { huongDanService } from 'src/app/services/huongDan.service';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { HoiDong } from './../../models/HoiDong.model';
import { boMonService } from './../../services/boMon.service';
import { truongBmService } from './../../services/truongBm.service';
import { truongKhoaService } from './../../services/truongKhoa.service';
import { shareService } from './../../services/share.service';
import { giangVienService } from './../../services/giangVien.service';
import { GiangVien } from './../../models/GiangVien.model';
import { Component, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss'],
  providers: [HomeMainComponent],
})
export class HomeMainComponent {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = GiangVien;
  listTB: ThongBao[] = [];
  static maBm: string;
  static maKhoa: string;
  static maGV: string;

  maBm!: string;
  maKhoa!: string;
  maGV = '' + localStorage.getItem('Id')?.toString();

  hoiDong: any = HoiDong;
  itemNumber = 9;

  boMon = '';

  cNhiemVu: number[] = [];

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
    private thongBaoService: thongBaoService,
    private nhiemVuService: nhiemVuService,
    private huongDanService: huongDanService,
    private phanBienService: phanBienService
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
    HomeMainComponent.maGV = this.maGV;
    // Get dữ liệu của giáo viên
    this.data = await this.giangVienService.getById(this.maGV);
    this.boMon = (await this.boMonService.getById(this.data.maBm)).tenBm;

    // Kiểm tra có phải là trưởng bộ môn hoặc trưởng khoa hay không?
    if (await this.truongBmService.isTruongBomonByMaGV(this.maGV)) {
      this.maBm = await (
        await this.truongBmService.CheckTruongBomonByMaGV(this.maGV)
      ).maBm;
      HomeMainComponent.maBm = this.maBm;
    }
    if (await this.truongKhoaService.isTruongKhoaByMaGV(this.maGV)) {
      this.maKhoa = await (
        await this.truongKhoaService.CheckTruongKhoaByMaGV(this.maGV)
      ).maKhoa;
      HomeMainComponent.maKhoa = this.maKhoa;
    }

    this.cNhiemVu = await this.giangVienService.GetSoLuongNhiemVu(HomeMainComponent.maGV, shareService.namHoc, shareService.dot);

    // Nếu có chức vụ hoặc tham gia hội đồng thì giảm item xuống và css lại
    this.resetNavbar();

    this.listTB = await this.thongBaoService.getAll();
  }

  resetNavbar() {
    var navbar = this.el.nativeElement.querySelector('#navbar');
    var number = navbar.querySelectorAll('li').length;

    var navbar_items = this.el.nativeElement.querySelectorAll('.navbar-item');
    navbar_items.forEach((item: { style: { flexBasis: string } }) => {
      item.style.flexBasis = 'calc(100% / ' + number + ')';
    });
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
