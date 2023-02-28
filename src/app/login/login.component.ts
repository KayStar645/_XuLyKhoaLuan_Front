import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { AppComponent } from './../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getTestBed } from '@angular/core/testing';
import { Component, OnInit, Renderer2, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../models/User.model';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  role!: string;
  loginForm: FormGroup;
  apiUrl = environment.api;

  getTest() {
    this.giaoVuService.getById('GV00003').subscribe(
      (user) => {
        // Xử lý kết quả trả về
        console.log(user);
      },
      (error) => {
        // Xử lý lỗi
        console.log(error);
      }
    );
    // this.giaoVuService.getById('GV00003').subscribe(data => console.log(data));
  }
  getAllTest() {
    this.giaoVuService.getAll().subscribe(
      (user) => {
        // Xử lý kết quả trả về
        console.log(user);
      },
      (error) => {
        // Xử lý lỗi
        console.log(error);
      }
    );
    // this.giaoVuService.getAll().subscribe(data => console.log(data));
  }

  postTest() {
    var giaoVu = new GiaoVu();
    giaoVu.MaGV = 'GV00003';
    giaoVu.TenGV = 'Đặng Trần Toàn';
    giaoVu.GioiTinh = 'Nam';
    giaoVu.Email = 'khanhdt@hufi.edu.vn';
    giaoVu.MaKhoa = 'CNTT';

    this.giaoVuService.add(giaoVu).subscribe(
      (user) => {
        // Xử lý kết quả trả về
        console.log(user);
      },
      (error) => {
        // Xử lý lỗi
        console.log(error);
      }
    );
  }

  updateTest() {
    var giaoVu = new GiaoVu();
    giaoVu.MaGV = 'GV00003';
    giaoVu.TenGV = 'Cao Công Khởi';
    giaoVu.GioiTinh = 'Nam';
    giaoVu.Email = 'khoicc@hufi.edu.vn';
    giaoVu.MaKhoa = 'CNTT';

    this.giaoVuService.update(giaoVu).subscribe(
      (user) => {
        // Xử lý kết quả trả về
        console.log(user);
      },
      (error) => {
        // Xử lý lỗi
        console.log(error);
      }
    );
    // console.log(this.giaoVuService.update(giaoVu).subscribe(data => console.log(data)));
  }

  deleteTest() {
    this.giaoVuService.delete('GV00003').subscribe(
      (user) => {
        // Xử lý kết quả trả về
        console.log(user);
      },
      (error) => {
        // Xử lý lỗi
        console.log(error);
      }
    );
    // console.log(this.giaoVuService.delete('GV00003').subscribe(data => console.log(data)));
  }

  constructor(private elementRef: ElementRef, private authService: AuthService,
     private router: Router, private fb: FormBuilder, private http: HttpClient,
     private giaoVuService : giaoVuService) {
       this.loginForm = this.fb.group({
         username: ['', Validators.required],
         password: ['', Validators.required]
        });
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  clickRole(event:any): void {
    // Gán vai trò đăng nhập của người dùng
    this.role = event.target.getAttribute('name');

    // Ẩn form chọn vai trò
    const form_role = this.elementRef.nativeElement.querySelector('#form__role');
    form_role.style.display = "none";
    // Hiện form đăng nhập
    const form_login = this.elementRef.nativeElement.querySelector('#form');
    form_login.style.display = "block";
  }

  clickBack(event:any): void {
    // Hiện form chọn vai trò
    const form_role = this.elementRef.nativeElement.querySelector('#form__role');
    form_role.style.display = "flex";
    // Ẩn form đăng nhập
    const form_login = this.elementRef.nativeElement.querySelector('#form');
    form_login.style.display = "none";
  }

  logIn() {
    var user = new User(this.loginForm.value["username"], this.loginForm.value["password"]);

    // this.authService.logIn(user, this.role).subscribe(result => {
    //   if (result) {
    //     this.router.navigate(['/dashboard']);
    //   }
    // });  

    this.router.navigate(['/home']);
    this.authService.logIn(user, this.role);

    console.log("localStorage: ")
    console.log(localStorage.getItem('token'))

    console.log("End: ")
    console.log(this.authService.isLoggedIn())
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // this.authService.logIn(user, this.role).subscribe(
    //   (response) => {
        

    //     this.router.navigate(['/dashboard']);
    //   },
    //   (error) => {
    //     // Xử lý lỗi đăng nhập (ví dụ: hiển thị thông báo lỗi)
    //   }
    // );
  }
}
