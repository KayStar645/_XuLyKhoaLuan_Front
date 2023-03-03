import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data!: GiaoVu;
  countTB = 0;
  countKH = 0;
  constructor(private authService: AuthService, private router: Router,
    private giaoVuService: giaoVuService, private elementRef: ElementRef) {}

  public ngOnInit(): void {
    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if(!(this.isLoggedIn$ && localStorage.getItem('role') == "Admin")) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    }
    else {
      this.isLoggedIn$ = of(true);
      this.router.navigate(['/']);
    }

    // Get dữ liệu của giáo vụ
    this.giaoVuService.getById("" + localStorage.getItem('Id')?.toString()).subscribe((data) => {
      this.data = data;
      if(this.data.ngaySinh != null) {
        this.data.ngaySinh = this.data.ngaySinh.substring(8, 10) + "/" +
                           this.data.ngaySinh.substring(5, 7) + "/" +
                           this.data.ngaySinh.substring(0, 4);
      }
      if(this.data.ngayNhanViec != null) {
        this.data.ngayNhanViec = this.data.ngayNhanViec.substring(8, 10) + "/" +
                           this.data.ngayNhanViec.substring(5, 7) + "/" +
                           this.data.ngayNhanViec.substring(0, 4);
      }
    });
    this.router.navigate(['/admin-main']);
  }

  clickAccount() {
    const form_login = this.elementRef.nativeElement.querySelector('#box-account');
    if(form_login.style.display == "none") {
      form_login.style.display = "block";
    }
    else {
      form_login.style.display = "none";
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
