import { MinistryDetaiComponent } from './ministry/ministry-detai/ministry-detai.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardThongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-thongbao.component';
import { DashboardLoimoiComponent } from './dashboard/dashboard-loimoi/dashboard-loimoi.component';
import { TestComponent } from './test/test.component';

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

import { HomeMainComponent } from './home/home-main/home-main.component';
import { HomeThongbaoComponent } from './home/home-thongbao/home-thongbao.component';
import { HomeKehoachComponent } from './home/home-kehoach/home-kehoach.component';
import { HomeGiangvienComponent } from './home/home-giangvien/home-giangvien.component';
import { HomeDetaiComponent } from './home/home-detai/home-detai.component';
import { HomeSinhvienComponent } from './home/home-sinhvien/home-sinhvien.component';
import { HomeHoidongComponent } from './home/home-hoidong/home-hoidong.component';
import { HomeGiaobaitapComponent } from './home/home-giaobaitap/home-giaobaitap.component';
import { HomeLichphanbienComponent } from './home/home-lichphanbien/home-lichphanbien.component';

import { MinistryComponent } from './ministry/ministry.component';
import { MinistryMainComponent } from './ministry/ministry-main/ministry-main.component';
import { MinistryGiangvienComponent } from './ministry/ministry-giangvien/ministry-giangvien.component';
import { MinistryHoidongComponent } from './ministry/ministry-hoidong/ministry-hoidong.component';
import { MinistryKehoachComponent } from './ministry/ministry-kehoach/ministry-kehoach.component';
import { MinistryNhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-nhiemvu.component';
import { MinistryQuanlychungComponent } from './ministry/ministry-quanlychung/ministry-quanlychung.component';
import { MinistrySinhvienComponent } from './ministry/ministry-sinhvien/ministry-sinhvien.component';
import { MinistryThongbaoComponent } from './ministry/ministry-thongbao/ministry-thongbao.component';
import { MinistryDanhsachgiangvienComponent } from './ministry/ministry-giangvien/ministry-danhsachgiangvien/ministry-danhsachgiangvien.component';
import { MinistryDanhsachsinhvienComponent } from './ministry/ministry-sinhvien/ministry-danhsachsinhvien/ministry-danhsachsinhvien.component';
import { MinistryDanhsachdetaiComponent } from './ministry/ministry-detai/ministry-danhsachdetai/ministry-danhsachdetai.component';
import { HomeNhiemvuComponent } from './home/home-nhiemvu/home-nhiemvu.component';
import { MinistryDanhsachthongbaoComponent } from './ministry/ministry-thongbao/ministry-danhsachthongbao/ministry-danhsachthongbao.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    MinistryComponent,
    MinistryMainComponent,
    MinistryThongbaoComponent,
    MinistryKehoachComponent,
    MinistryGiangvienComponent,
    MinistryDanhsachgiangvienComponent, //--
    MinistryNhiemvuComponent,
    MinistryDetaiComponent,
    MinistryDanhsachdetaiComponent, //--
    MinistrySinhvienComponent,
    MinistryDanhsachsinhvienComponent, //--
    MinistryHoidongComponent,
    MinistryQuanlychungComponent,

    HomeComponent,
    HomeMainComponent,


    DashboardComponent,
    HomeNhiemvuComponent,
    
    DashboardMainComponent,
    DashboardThongbaoComponent,
    DashboardLoimoiComponent,


    HomeThongbaoComponent,
    HomeKehoachComponent,
    HomeGiangvienComponent,
    HomeDetaiComponent,
    HomeSinhvienComponent,
    HomeHoidongComponent,
    HomeGiaobaitapComponent,
    HomeLichphanbienComponent,

    TestComponent,
      MinistryDanhsachthongbaoComponent,
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
    // DanhsachgiangvienComponent,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
