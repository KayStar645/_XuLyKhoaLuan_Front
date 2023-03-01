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
    // if(this.isLoggedIn$) {
    //   if(this.role === "Admin") {
    //     this.router.navigate(['/admin']);
    //   }
    //   else if (this.role === "Teacher") {
    //     this.router.navigate(['/home']);
    //   }
    //   else if(this.role === "Studnet") {
    //     this.router.navigate(['/dashboard']);
    //   }
    // }
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

    if(this.authService.logIn(user, this.role)) {
      // console.log("Xử lý lỗi!");
      if(this.role === "Admin") {
        this.router.navigate(['/admin']);
      }
      else if (this.role === "Teacher") {
        this.router.navigate(['/home']);
      }
      else if(this.role === "Studnet") {
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
