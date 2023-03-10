import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { AppComponent } from './../app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getTestBed } from '@angular/core/testing';
import {
  Component,
  OnInit,
  Renderer2,
  ViewEncapsulation,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import { Form } from 'src/assets/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  title = 'Đăng nhập';
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();

  role!: string;
  activeForm: boolean = false;
  form = new Form({
    username: ['', Validators.required],
    password: ['', Validators.required],
    protectCode: ['', Validators.required],
  });
  loginForm: any;
  apiUrl = environment.api;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private giaoVuService: giaoVuService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.form.form;
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (this.isLoggedIn$) {
      if (localStorage.getItem('role') === 'Admin') {
        this.router.navigate(['/admin']);
      } else if (localStorage.getItem('role') === 'Teacher') {
        this.router.navigate(['/home']);
      } else if (localStorage.getItem('role') === 'Studnet') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  ngAfterViewInit(): void {}

  clickRole(event: any): void {
    // Gán vai trò đăng nhập của người dùng
    this.role = event.target.getAttribute('name');

    // Ẩn form chọn vai trò
    const form_role =
      this.elementRef.nativeElement.querySelector('#form__role');
    form_role.style.display = 'none';

    this.activeForm = !this.activeForm;
  }

  clickBack(event: any): void {
    // Hiện form chọn vai trò
    const form_role =
      this.elementRef.nativeElement.querySelector('#form__role');
    form_role.style.display = 'block';
    this.activeForm = !this.activeForm;
  }

  onBlur(event: any): void {
    this.form.inputBlur(event);
  }

  logIn() {
    var user = new User(
      this.loginForm.value['username'],
      this.loginForm.value['password']
    );

    if (!this.loginForm.valid) {
      this.form.validate('#form');
    } else {
      let form: any = document.querySelector('#form');

      this.authService
        .logIn(user, this.role)
        .pipe()
        .subscribe({
          next: (data) => {},
          error: (err) => {
            localStorage.setItem('token', err.error.text);
            localStorage.setItem('Id', user.Id);
            localStorage.setItem('role', this.role);
            if (this.role === 'Admin') {
              this.router.navigate(['/admin']);
              // window.location.href = window.location.origin + '/admin';
            } else if (this.role === 'Teacher') {
              this.router.navigate(['/home']);
            } else if (this.role === 'Student') {
              this.router.navigate(['/dashboard']);
            }
            form.classList.add('invalid');
          },
        });
    }
  }
}
