import { environment } from 'src/environments/environment';
import { HomeDanhsachgiangvienComponent } from './home-danhsachgiangvien/home-danhsachgiangvien.component';
import { BoMon } from '../../models/BoMon.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';

@Component({
   selector: 'app-home-giangvien',
   templateUrl: './home-giangvien.component.html',
})
export class HomeGiangvienComponent implements OnInit {
   public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
   @ViewChild(HomeDanhsachgiangvienComponent)
   listBoMon: BoMon[] = [];
   searchName = '';

   constructor(
      private titleService: Title,
      private authService: AuthService,
      private router: Router
   ) {}

   async ngOnInit() {
      this.titleService.setTitle('Danh sách giảng viên');
      // Kiểm tra đăng nhập để điều hướng
      this.isLoggedIn$ = this.authService.isLoggedIn();
      if (!(this.isLoggedIn$ && localStorage.getItem('role') == environment.Teacher)) {
         this.isLoggedIn$ = of(false);
         this.router.navigate(['/login']);
      } else {
         this.isLoggedIn$ = of(true);
      }
   }
}
