import { shareService } from './../services/share.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';
import { SinhVien } from '../models/SinhVien.model';
import { sinhVienService } from '../services/sinhVien.service';
import { thamGiaService } from '../services/thamGia.service';
import { dangKyService } from '../services/dangKy.service';
import { raDeService } from '../services/raDe.service';
import { ToastrService } from 'ngx-toastr';
import { newUser } from '../models/newUser.model';
import { environment } from 'src/environments/environment';

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
   title = 'Sinh viên';
   public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
   data: any = SinhVien;
   countTB = 0;
   countKH = 0;
   static maNhom = '';
   static maSV = '';
   static isSignUpDeTai = false;
   static maDT = '';
   static maGvhd: string[] = [];
   static clickHomeFirstTime = false;

   isReset: boolean = false;

   constructor(
      private authService: AuthService,
      private router: Router,
      private sinhVienService: sinhVienService,
      private elementRef: ElementRef,
      private shareService: shareService,
      private thamGiaService: thamGiaService,
      private dangKyService: dangKyService,
      private raDeService: raDeService,
      private toastService: ToastrService
   ) {}

   public async ngOnInit() {
      // Kiểm tra đăng nhập để điều hướng
      if (!(this.isLoggedIn$ && localStorage.getItem('role') == environment.Student)) {
         this.isLoggedIn$ = of(false);
         this.router.navigate(['/login']);
      } else {
         this.isLoggedIn$ = of(true);
      }

      // Get dữ liệu của sinh viên
      this.data = await this.sinhVienService.getById('' + localStorage.getItem('Id')?.toString());
      await this.shareService.namHocDotDk();

      DashboardComponent.maSV = '' + localStorage.getItem('Id')?.toString();

      //Cần kiểm tra có nhóm trong tham gia không?
      if (
         await this.thamGiaService.isJoinedAGroup(
            DashboardComponent.maSV,
            shareService.namHoc,
            shareService.dot
         )
      ) {
         let maNhom = (
            await this.thamGiaService.getById(
               DashboardComponent.maSV,
               shareService.namHoc,
               shareService.dot
            )
         ).maNhom;
         DashboardComponent.maNhom = maNhom === null || maNhom === '' ? '' : maNhom;
         DashboardComponent.isSignUpDeTai =
            (await this.dangKyService.getAll()).filter((dk) => dk.maNhom === maNhom).length > 0
               ? true
               : false;
         if (DashboardComponent.isSignUpDeTai) {
            DashboardComponent.maDT = (await this.dangKyService.getAll()).filter(
               (dk) => dk.maNhom === maNhom
            )[0].maDt;
            let lstGvhd = (await this.raDeService.getAll()).filter(
               (rd) => rd.maDt === DashboardComponent.maDT
            );
            lstGvhd.forEach((gv) => DashboardComponent.maGvhd.push(gv.maGv));
         }
      }
   }

   reloadRoute() {
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
         this.router.navigate(['/dashboard']);
      });
      if (this.shareService.getIsFirstClickHome()) {
         window.location.reload();
         this.shareService.setIsFirstClickHome(false);
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
         await this.authService.changePassword(new newUser(this.data.maSv, data.old, data.new));
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
