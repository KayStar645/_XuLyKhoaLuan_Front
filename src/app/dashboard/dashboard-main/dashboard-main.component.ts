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
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit{
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = SinhVien;
  countTB = 0;
  countKH = 0;
  chuyenNganh = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private sinhVienService: sinhVienService,
    private titleService: Title,
    private shareService: shareService,
    private chuyenNganhService: chuyenNganhService,
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle('Sinh viên');

    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Student')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của giáo vụ
    this.sinhVienService
      .getById('' + localStorage.getItem('Id')?.toString())
      .subscribe((data) => {
        this.data = data;
        console.log(data);
        this.chuyenNganhService.getById(data.maCn).subscribe((data) => this.chuyenNganh = data.tenCn);
      });
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }

  goToRoute(event: any){
    const data = {
      id: this.data.maSv
    }
    this.router.navigate(['/dashboard/dashboard-loimoi'], {queryParams: data});
  }
}