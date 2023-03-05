import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ThongbaoComponent } from './admin/thongbao/thongbao.component';
import { DanhsachsinhvienComponent } from './admin/danhsachsinhvien/danhsachsinhvien.component';
import { DanhsachgiangvienComponent } from './admin/danhsachgiangvien/danhsachgiangvien.component';
import { DanhsachdetaiComponent } from './admin/danhsachdetai/danhsachdetai.component';
import { KehoachComponent } from './admin/kehoach/kehoach.component';
import { HoidongComponent } from './admin/hoidong/hoidong.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { PhancongComponent } from './admin/phancong/phancong.component';
import { QuanlychungComponent } from './admin/quanlychung/quanlychung.component';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 

    AdminComponent, 
    ThongbaoComponent,
    DanhsachsinhvienComponent, 
    DanhsachgiangvienComponent, 
    DanhsachdetaiComponent, 
    KehoachComponent, 
    HoidongComponent, 
    AdminMainComponent,

    HomeComponent, 

    DashboardComponent, PhancongComponent, QuanlychungComponent, TestComponent, 
  ],

  imports: [
    HttpClientModule, 
    BrowserModule, 
    AppRoutingModule, 
    ReactiveFormsModule
  ],

  providers: [HttpClient, 
    FormBuilder, 
    BrowserModule, 
    AppRoutingModule],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
