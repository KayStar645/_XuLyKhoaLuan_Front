import { shareService } from './../../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GiaoVu } from 'src/app/models/GiaoVu.model';
import { giaoVuService } from 'src/app/services/giaoVu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data!: GiaoVu;
  countTB = 0;
  countKH = 0;
  constructor(private authService: AuthService, private router: Router,
    private giaoVuService: giaoVuService, private titleService: Title,
    private shareService: shareService) {}

  public ngOnInit(): void {
    this.titleService.setTitle('Quản lý');

    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if(!(this.isLoggedIn$ && localStorage.getItem('role') == "Admin")) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    }
    else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của giáo vụ
    this.giaoVuService.getById("" + localStorage.getItem('Id')?.toString()).subscribe((data) => {
      this.data = data;
    });
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
