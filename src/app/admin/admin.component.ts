import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { shareService } from './../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  title = 'Quản lý';
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data!: GiaoVu;
  countTB = 0;
  countKH = 0;
  // Sửa lại sau
  public role!: string;
  public id!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private giaoVuService: giaoVuService,
    private elementRef: ElementRef,
    private shareService: shareService
  ) {}

  public ngOnInit(): void {
    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Admin')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }
    this.router.navigate(['/admin', 'admin-main']);

    // Get dữ liệu của giáo vụ
    this.giaoVuService.getById("" + localStorage.getItem('Id')?.toString()).subscribe((data) => {
      this.data = data;
    });
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']); // Tạm thời
  }

  clickAccount() {
    const form_logout =
      this.elementRef.nativeElement.querySelector('#box-account');
    const form_logout2 =
      this.elementRef.nativeElement.querySelector('#box-body');
    if (!form_logout.classList.contains('active')) {
      form_logout.classList.add('active');
      form_logout2.classList.add('active');
    } else {
      form_logout.classList.remove('active');
      form_logout2.classList.remove('active');
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
