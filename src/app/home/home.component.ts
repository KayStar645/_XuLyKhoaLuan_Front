import { dotDkService } from './../services/dotDk.service';
import { shareService } from './../services/share.service';
import { giangVienService } from './../services/giangVien.service';
import { GiangVien } from './../models/GiangVien.model';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { newUser } from '../models/newUser.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

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

   isReset: boolean = false;

   constructor(
      private authService: AuthService,
      private router: Router,
      private elementRef: ElementRef,
      private giangVienService: giangVienService,
      private shareService: shareService,
      private toastService: ToastrService
   ) {}

   public async ngOnInit() {
      // Kiểm tra đăng nhập để điều hướng
      this.isLoggedIn$ = this.authService.isLoggedIn();
      if (!(this.isLoggedIn$ && localStorage.getItem('role') == environment.Teacher)) {
         this.isLoggedIn$ = of(false);
         this.router.navigate(['/login']);
      } else {
         this.isLoggedIn$ = of(true);
      }

      // Get dữ liệu của giảng viên
      this.data = await this.giangVienService.getById('' + localStorage.getItem('Id')?.toString());

      await this.shareService.namHocDotDk();
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
         this.toastService.warning(
            'Mật khẩu không hợp lệ, Đổi mật khẩu không thành công!',
            'Thông báo'
         );
      }
   }

   logOut() {
      this.authService.logOut();
      this.router.navigate(['/login']);
   }
}
