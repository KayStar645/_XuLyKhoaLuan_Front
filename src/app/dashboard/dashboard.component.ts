import { shareService } from './../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';
import { SinhVien } from '../models/SinhVien.model';
import { sinhVienService } from '../services/sinhVien.service';
import { dotDkService } from '../services/dotDk.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Sinh viên';
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = SinhVien;
  countTB = 0;
  countKH = 0;
  namHoc: string = "";
  dot: number = 0;

  // Sửa lại sau
  public role!: string;
  public id!: string;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private sinhVienService: sinhVienService,
    private elementRef: ElementRef,
    private shareService: shareService,
    private dotDkService: dotDkService,
  ) {}

  public async ngOnInit() {

    // Kiểm tra đăng nhập để điều hướng
    //this.isLoggedIn$ = this.authService.isLoggedIn(); [Tạm thời]
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Student')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của sinh viên
    this.data = await this.sinhVienService.getById('' + localStorage.getItem('Id')?.toString());
    // Lấy năm học và đợt mới nhất
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