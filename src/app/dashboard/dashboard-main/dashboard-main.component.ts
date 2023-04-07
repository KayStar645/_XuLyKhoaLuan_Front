import { thongBaoService } from 'src/app/services/thongBao.service';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from './../../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { sinhVienService } from 'src/app/services/sinhVien.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss'],
})
export class DashboardMainComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = SinhVien;
  listTB: ThongBao[] = [];
  countTB = 0;
  countKH = 0;
  chuyenNganh = '';
  isJoinedGroup = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private sinhVienService: sinhVienService,
    private titleService: Title,
    private shareService: shareService,
    private chuyenNganhService: chuyenNganhService,
    private thongBaoService: thongBaoService,
    private el: ElementRef
  ) {}

  public async ngOnInit() {
    this.titleService.setTitle('Sinh viên');

    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Student')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    this.resetNavbar();

    // Get dữ liệu của sinh viên
    this.data = await this.sinhVienService.getById(
      '' + localStorage.getItem('Id')?.toString()
    );
    this.chuyenNganh = (
      await this.chuyenNganhService.getById(this.data.maCn)
    ).tenCn;
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