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
import { SinhvienComponent } from './admin/sinhvien/sinhvien.component';
import { DetaiComponent } from './admin/detai/detai.component';
import { KehoachComponent } from './admin/kehoach/kehoach.component';
import { HoidongComponent } from './admin/hoidong/hoidong.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { PhancongComponent } from './admin/phancong/phancong.component';
import { QuanlychungComponent } from './admin/quanlychung/quanlychung.component';
import { TestComponent } from './test/test.component';
import { GiangvienComponent } from './admin/giangvien/giangvien.component';
import { DanhsachgiangvienComponent } from './admin/giangvien/danhsachgiangvien/danhsachgiangvien.component';
import { DanhsachsinhvienComponent } from './admin/sinhvien/danhsachsinhvien/danhsachsinhvien.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardThongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-thongbao.component';
import { DashboardLoimoiComponent } from './dashboard/dashboard-loimoi/dashboard-loimoi.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 

    AdminComponent, AdminMainComponent,
    DetaiComponent, 
    GiangvienComponent, DanhsachgiangvienComponent,
    HoidongComponent, 
    KehoachComponent, 
    PhancongComponent,
    QuanlychungComponent,
    SinhvienComponent, 
    ThongbaoComponent, 

    HomeComponent, 

    DashboardComponent, PhancongComponent, QuanlychungComponent, TestComponent, DanhsachgiangvienComponent, DanhsachsinhvienComponent, DashboardMainComponent, DashboardThongbaoComponent, DashboardLoimoiComponent, 
  ],

  imports: [
    HttpClientModule, 
    BrowserModule, 
    AppRoutingModule, 
    ReactiveFormsModule,
    FormsModule,
  ],

  providers: [HttpClient, 
    FormBuilder, 
    BrowserModule, 
    AppRoutingModule,
    DanhsachgiangvienComponent,],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
