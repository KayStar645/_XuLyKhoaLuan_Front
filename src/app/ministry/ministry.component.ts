import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { shareService } from './../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';
import { newUser } from '../models/newUser.model';
import { Toast } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-ministry',
   templateUrl: './ministry.component.html',
   styleUrls: ['./ministry.component.scss'],
})
export class MinistryComponent implements OnInit {
   title = 'Quản lý';
   public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
   data: any = GiaoVu;
   countTB = 0;
   countKH = 0;
   namHoc = '';
   dot = -1;
   // Sửa lại sau
   public role!: string;
   public id!: string;
   isReset: boolean = false;

   constructor(
      private authService: AuthService,
      private router: Router,
      private giaoVuService: giaoVuService,
      private elementRef: ElementRef,
      private shareService: shareService,
      private toastService: ToastrService
   ) {}

   public async ngOnInit() {
      // Kiểm tra đăng nhập để điều hướng
      this.isLoggedIn$ = this.authService.isLoggedIn();
      if (!(this.isLoggedIn$ && localStorage.getItem('role') == environment.Ministry)) {
         this.isLoggedIn$ = of(false);
         this.router.navigate(['/login']);
      } else {
         this.isLoggedIn$ = of(true);
      }

      // Get dữ liệu của giáo vụ
      this.data = await this.giaoVuService.getById('' + localStorage.getItem('Id')?.toString());

      await this.shareService.namHocDotDk();
   }

   async onConfirmPassword(data: any) {
      if (data.confirm.lenght < 6 && data.new.lenght < 6) {
         this.toastService.warning('Độ dài mật khẩu ít nhất bằng 6!', 'Thông báo');
         return;
      }
      if (data.confirm != data.new) {
         this.toastService.warning('Mật khẩu không khớp!', 'Thông báo');
         return;
      }

      try {
         await this.authService.changePassword(new newUser(this.data.maGv, data.old, data.new));
         this.toastService.success('Đổi mật khẩu thành công!', 'Thông báo');
      } catch (error) {
         this.toastService.warning('Mật khẩu không hợp lệ, Đổi mật khẩu không thành công!', 'Thông báo');
      }
   }

   clickAccount() {
      const form_logout = this.elementRef.nativeElement.querySelector('#box-account');
      const form_logout2 = this.elementRef.nativeElement.querySelector('#box-body');
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
