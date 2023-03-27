import { thongBaoService } from 'src/app/services/thongBao.service';
import { shareService } from '../../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { GiaoVu } from 'src/app/models/GiaoVu.model';
import { giaoVuService } from 'src/app/services/giaoVu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Title } from '@angular/platform-browser';
import { ThongBao } from 'src/app/models/ThongBao.model';

@Component({
  selector: 'app-ministry-main',
  templateUrl: './ministry-main.component.html',
  styleUrls: ['./ministry-main.component.scss'],
})
export class MinistryMainComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data: any = GiaoVu;
  listTB: ThongBao[] = [];
  countTB = 0;
  countKH = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private giaoVuService: giaoVuService,
    private titleService: Title,
    private shareService: shareService,
    private thongBaoService: thongBaoService,
  ) {}

  public async ngOnInit() {
    this.titleService.setTitle('Quản lý');

    // Kiểm tra đăng nhập để điều hướng
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (!(this.isLoggedIn$ && localStorage.getItem('role') == 'Ministry')) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    } else {
      this.isLoggedIn$ = of(true);
    }

    // Get dữ liệu của giáo vụ
    this.data = await this.giaoVuService.getById(
      '' + localStorage.getItem('Id')?.toString()
    );
    this.listTB = await this.thongBaoService.getAll();
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
