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

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DanhsachdetaiComponent } from './admin/detai/danhsachdetai/danhsachdetai.component';
import { QuillModule } from 'ngx-quill';
import { HomeMainComponent } from './home/home-main/home-main.component';
import { HomeThongbaoComponent } from './home/home-thongbao/home-thongbao.component';
import { HomeKehoachComponent } from './home/home-kehoach/home-kehoach.component';
import { HomePhancongComponent } from './home/home-phancong/home-phancong.component';
import { HomeGiangvienComponent } from './home/home-giangvien/home-giangvien.component';
import { HomeDetaiComponent } from './home/home-detai/home-detai.component';
import { HomeSinhvienComponent } from './home/home-sinhvien/home-sinhvien.component';
import { HomeHoidongComponent } from './home/home-hoidong/home-hoidong.component';
import { HomeGiaobaitapComponent } from './home/home-giaobaitap/home-giaobaitap.component';
import { HomeLichphanbienComponent } from './home/home-lichphanbien/home-lichphanbien.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    AdminComponent,
    AdminMainComponent,
    DetaiComponent,
    GiangvienComponent,
    DanhsachgiangvienComponent,
    HoidongComponent,
    KehoachComponent,
    PhancongComponent,
    QuanlychungComponent,
    SinhvienComponent,
    ThongbaoComponent,

    HomeComponent,
    HomeMainComponent,


    DashboardComponent,
    PhancongComponent,
    QuanlychungComponent,
    DanhsachgiangvienComponent,
    DanhsachsinhvienComponent,
    DashboardMainComponent,
    DashboardThongbaoComponent,
    DashboardLoimoiComponent,
    DanhsachdetaiComponent,
    
    
    TestComponent,
                HomeThongbaoComponent,
                HomeKehoachComponent,
                HomePhancongComponent,
                HomeGiangvienComponent,
                HomeDetaiComponent,
                HomeSinhvienComponent,
                HomeHoidongComponent,
                HomeGiaobaitapComponent,
                HomeLichphanbienComponent,
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,

    NgProgressModule,
    NgProgressHttpModule,

    BrowserAnimationsModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      timeOut: 3500,
      titleClass: 'toast-title',
      messageClass: 'toast-mess',
    }),
  ],

  providers: [
    HttpClient,
    FormBuilder,
    BrowserModule,
    AppRoutingModule,
    DanhsachgiangvienComponent,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
