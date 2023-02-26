import { AppComponent } from './../app.component';
import { getTestBed } from '@angular/core/testing';
import { Component, OnInit, Renderer2, ViewEncapsulation, ElementRef } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  role = "Student";

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
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
}
