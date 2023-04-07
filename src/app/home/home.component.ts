import { giangVienService } from './../services/giangVien.service';
import { GiangVien } from './../models/GiangVien.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { dotDkService } from '../services/dotDk.service';
import { shareService } from '../services/share.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private giangVienService: giangVienService,
    private dotDkService: dotDkService,
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

    const latestYear = (await this.dotDkService.getAll()).sort((a, b) => {
      if (a.namHoc !== b.namHoc) {
        return b.namHoc.localeCompare(a.namHoc);
      } else {
        return b.dot - a.dot;
      }
    })[0];
    this.namHoc = latestYear.namHoc;
    this.dot = latestYear.dot;
    this.shareService.setNamHoc(this.namHoc);
    this.shareService.setDot(this.dot);
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
