import { shareService } from './../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';
import { SinhVien } from '../models/SinhVien.model';
import { sinhVienService } from '../services/sinhVien.service';

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
  // Sửa lại sau
  public role!: string;
  public id!: string;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private sinhVienService: sinhVienService,
    private elementRef: ElementRef,
    private shareService: shareService
  ) {}

  public ngOnInit(): void {
    //Set thông tin ban đầu [Tạm thời]
    localStorage.setItem('role', 'Student');
    this.isLoggedIn$ = of(true);
    localStorage.setItem('Id','SV001');

    // Kiểm tra đăng nhập để điều hướng
    //this.isLoggedIn$ = this.authService.isLoggedIn(); [Tạm thời]
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Student')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }
    this.router.navigate(['/dashboard', 'dashboard-main']);

    // Get dữ liệu của sinh viên
    this.sinhVienService
      .getById('' + localStorage.getItem('Id')?.toString())
      .subscribe((data) => {
        this.data = data;
      });
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