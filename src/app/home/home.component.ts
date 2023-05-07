import { dotDkService } from './../services/dotDk.service';
import { shareService } from './../services/share.service';
import { giangVienService } from './../services/giangVien.service';
import { GiangVien } from './../models/GiangVien.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = GiangVien;
  countTB = 0;
  countKH = 0;
  namHoc = '';
  dot = -1;
  chucVu = 0; // 0 là không có chức, 1 là trưởng bộ môn, 2 là trưởng khoa

  static namHoc: string;
  static dot: number;
  static maGv: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private giangVienService: giangVienService,
    private shareService: shareService
  ) {}

  public async ngOnInit() {
    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Teacher')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của giảng viên
    this.data = await this.giangVienService.getById(
      '' + localStorage.getItem('Id')?.toString()
    );

    
    await this.shareService.namHocDotDk();
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
