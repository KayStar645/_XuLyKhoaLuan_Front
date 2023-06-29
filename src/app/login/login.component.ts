import { Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../models/User.model';
import { Observable } from 'rxjs/internal/Observable';
import { Form } from 'src/assets/utils';
import * as jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  title = 'Đăng nhập';
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  
  activeForm: boolean = false;
  form = new Form({
    username: ['', Validators.required],
    password: ['', Validators.required],
    // protectCode: ['', Validators.required],
  });
  loginForm: any;
  apiUrl = environment.api;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    //private toastr: ToastrService
  ) {
    this.loginForm = this.form.form;
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if (this.isLoggedIn$) {
      if (localStorage.getItem('role') === environment.Ministry) {
        this.router.navigate(['/ministry']);
      } else if (localStorage.getItem('role') === environment.Teacher) {
         this.router.navigate(['/home']);
      } else if (localStorage.getItem('role') === environment.Student) {
         this.router.navigate(['/dashboard']);
      } else {
         this.router.navigate(['/login']);
      }
    }
  }

  ngAfterViewInit(): void {}

  onBlur(event: any): void {
    this.form.inputBlur(event);
  }

  async logIn() {
    var user = new User(
      this.loginForm.value['username'],
      this.loginForm.value['password']
    );

    if (!this.loginForm.valid) {
      this.form.validate('#form');
    } else {
      let form: any = document.querySelector('#form');

      try {
          let accessToken = await this.authService.logIn(user);
          localStorage.setItem('token', accessToken.jwt);
          localStorage.setItem('Id', user.Id);
          localStorage.setItem('role', accessToken.role);

          if (accessToken.role === 'M') {
             this.router.navigate(['/ministry']);
          } else if (accessToken.role === 'T') {
             this.router.navigate(['/home']);
          } else if (accessToken.role === 'S') {
             this.router.navigate(['/dashboard']);
          }
          form.classList.add('invalid');
      } catch (error) {
        
      }
    }
  }
}
