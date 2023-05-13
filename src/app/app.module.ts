import { HomeDanhsachsinhvienComponent } from './home/home-sinhvien/home-danhsachsinhvien/home-danhsachsinhvien.component';
import { HomeDanhsachdetaiComponent } from './home/home-detai/home-danhsachdetai/home-danhsachdetai.component';
import { HomeDanhsachgiangvienComponent } from './home/home-giangvien/home-danhsachgiangvien/home-danhsachgiangvien.component';
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
import { TestComponent } from './test/test.component';

import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { HomeMainComponent } from './home/home-main/home-main.component';
import { HomeThongbaoComponent } from './home/home-thongbao/home-thongbao.component';
import { HomeKehoachComponent } from './home/home-kehoach/home-kehoach.component';
import { HomeGiangvienComponent } from './home/home-giangvien/home-giangvien.component';
import { HomeDetaiComponent } from './home/home-detai/home-detai.component';
import { HomeSinhvienComponent } from './home/home-sinhvien/home-sinhvien.component';
import { HomeHoidongComponent } from './home/home-hoidong/home-hoidong.component';
import { HomeLichphanbienComponent } from './home/home-lichphanbien/home-lichphanbien.component';

import { MinistryComponent } from './ministry/ministry.component';
import { MinistryMainComponent } from './ministry/ministry-main/ministry-main.component';
import { MinistryGiangvienComponent } from './ministry/ministry-giangvien/ministry-giangvien.component';
import { MinistryKehoachComponent } from './ministry/ministry-kehoach/ministry-kehoach.component';
import { MinistryNhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-nhiemvu.component';
import { MinistrySinhvienComponent } from './ministry/ministry-sinhvien/ministry-sinhvien.component';
import { MinistryThongbaoComponent } from './ministry/ministry-thongbao/ministry-thongbao.component';
import { MinistryDanhsachgiangvienComponent } from './ministry/ministry-giangvien/ministry-danhsachgiangvien/ministry-danhsachgiangvien.component';
import { MinistryDanhsachsinhvienComponent } from './ministry/ministry-sinhvien/ministry-danhsachsinhvien/ministry-danhsachsinhvien.component';
import { MinistryDanhsachdetaiComponent } from './ministry/ministry-detai/ministry-danhsachdetai/ministry-danhsachdetai.component';
import { HomeNhiemvuComponent } from './home/home-nhiemvu/home-nhiemvu.component';
import { MinistryDanhsachthongbaoComponent } from './ministry/ministry-thongbao/ministry-danhsachthongbao/ministry-danhsachthongbao.component';
import { MinistryChitietthongbaoComponent } from './ministry/ministry-thongbao/ministry-chitietthongbao/ministry-chitietthongbao.component';
import { MinistryDotthamgiaComponent } from './ministry/ministry-dotthamgia/ministry-dotthamgia.component';
import { MinistryDanhsachthamgiaComponent } from './ministry/ministry-dotthamgia/ministry-danhsachthamgia/ministry-danhsachthamgia.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Location } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MinistryDanhsachnhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-danhsachnhiemvu/ministry-danhsachnhiemvu.component';
import { MinistryChitietnhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-chitietnhiemvu/ministry-chitietnhiemvu.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { HomeDanhsachnhiemvuComponent } from './home/home-nhiemvu/home-danhsachnhiemvu/home-danhsachnhiemvu.component';
import { HomeChitietnhiemvuComponent } from './home/home-nhiemvu/home-chitietnhiemvu/home-chitietnhiemvu.component';
import { MinistryDanhsachkehoachComponent } from './ministry/ministry-kehoach/ministry-danhsachkehoach/ministry-danhsachkehoach.component';
import { MinistryChitietkehoachComponent } from './ministry/ministry-kehoach/ministry-chitietkehoach/ministry-chitietkehoach.component';
import { DashboardNhomComponent } from './dashboard/dashboard-nhom/dashboard-nhom.component';
import { MinistryChitietdetaiComponent } from './ministry/ministry-detai/ministry-chitietdetai/ministry-chitietdetai.component';
import { HomeChitietdetaiComponent } from './home/home-detai/home-chitietdetai/home-chitietdetai.component';
import { HomeChitietkehoachComponent } from './home/home-kehoach/home-chitietkehoach/home-chitietkehoach.component';
import { HomeDanhsachkehoachComponent } from './home/home-kehoach/home-danhsachkehoach/home-danhsachkehoach.component';
import { HomeFormdetaiComponent } from './home/home-detai/home-formdetai/home-formdetai.component';
import { HomeHuongdanRadeComponent } from './home/home-nhiemvu/home-huongdan-rade/home-huongdan-rade.component';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { HomeDanhsachthongbaoComponent } from './home/home-thongbao/home-danhsachthongbao/home-danhsachthongbao.component';
import { DashboardDanhsachthongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-danhsachthongbao/dashboard-danhsachthongbao.component';
import { DashboardChitietthongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-chitietthongbao/dashboard-chitietthongbao.component';
import { HomeChitietthongbaoComponent } from './home/home-thongbao/home-chitietthongbao/home-chitietthongbao.component';
import { DashboardBaitapchitietComponent } from './dashboard/dashboard-nhom/dashboard-baitapchitiet/dashboard-baitapchitiet.component';
import { DashboardThemthanhvienComponent } from './dashboard/dashboard-themthanhvien/dashboard-themthanhvien.component';
import { DashboardDanhsachsinhvienComponent } from './dashboard/dashboard-themthanhvien/dashboard-danhsachsinhvien/dashboard-danhsachsinhvien.component';
import { HomeHuongdanComponent } from './home/home-huongdan/home-huongdan.component';
import { HomeNhomsinhvienComponent } from './home/home-huongdan/home-nhomsinhvien/home-nhomsinhvien.component';
import { HomeCongviecComponent } from './home/home-huongdan/home-congviec/home-congviec.component';
import { RouterModule } from '@angular/router';
import { HomeDanhsachbaitapComponent } from './home/home-huongdan/home-congviec/home-danhsachbaitap/home-danhsachbaitap.component';
import { DashbordDangkydetaiComponent } from './dashboard/dashbord-dangkydetai/dashbord-dangkydetai.component';
import { DashboardMainnhomComponent } from './dashboard/dashboard-nhom/dashboard-mainnhom/dashboard-mainnhom.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { HomeChitietbaitapComponent } from './home/home-huongdan/home-congviec/home-chitietbaitap/home-chitietbaitap.component';
import { HomeChamdiemComponent } from './home/home-chamdiem/home-chamdiem.component';
import { DashboardDanhsachdetaiComponent } from './dashboard/dashboard-danhsachdetai/dashboard-danhsachdetai.component';
import { DashboardLichbaocaoComponent } from './dashboard/dashboard-lichbaocao/dashboard-lichbaocao.component';
import { HomeQuanlychungComponent } from './home/home-quanlychung/home-quanlychung.component';
import { MinistryThongkediemComponent } from './ministry/ministry-thongkediem/ministry-thongkediem.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    MinistryComponent,
    MinistryMainComponent,
    MinistryThongbaoComponent,
    MinistryDanhsachthongbaoComponent,
    MinistryChitietthongbaoComponent,
    MinistryDanhsachnhiemvuComponent,
    MinistryChitietnhiemvuComponent,
    MinistryKehoachComponent,
    MinistryDanhsachkehoachComponent,
    MinistryChitietkehoachComponent,
    MinistryGiangvienComponent,
    MinistryDanhsachgiangvienComponent,
    MinistryNhiemvuComponent,
    MinistryDetaiComponent,
    MinistryDanhsachdetaiComponent,
    MinistryChitietdetaiComponent,
    MinistrySinhvienComponent,
    MinistryDanhsachsinhvienComponent,
    MinistryDotthamgiaComponent,
    MinistryDanhsachthamgiaComponent,
    DashboardNhomComponent,
    MinistryChitietdetaiComponent,

    HomeComponent,
    HomeMainComponent,
    HomeDetaiComponent,
    HomeDanhsachdetaiComponent,
    HomeChitietdetaiComponent,
    HomeGiangvienComponent,
    HomeDanhsachgiangvienComponent,
    HomeHoidongComponent,
    HomeKehoachComponent,
    HomeLichphanbienComponent,
    HomeNhiemvuComponent,
    HomeDanhsachnhiemvuComponent,
    HomeChitietnhiemvuComponent,
    HomeSinhvienComponent,
    HomeDanhsachsinhvienComponent,
    HomeThongbaoComponent,
    HomeChitietkehoachComponent,
    HomeDanhsachkehoachComponent,
    HomeFormdetaiComponent,
    HomeHuongdanRadeComponent,
    HomeHuongdanComponent,
    HomeNhomsinhvienComponent,
    HomeCongviecComponent,
    HomeDanhsachthongbaoComponent,
    HomeChitietthongbaoComponent,
    HomeDanhsachbaitapComponent,
    HomeChitietbaitapComponent,
    HomeChamdiemComponent,
    HomeQuanlychungComponent,

    DropDownComponent,

    DashboardComponent,
    DashboardBaitapchitietComponent,
    DashboardMainComponent,
    DashboardThongbaoComponent,
    DashboardNhomComponent,
    DashboardNhomComponent,
    DashboardDanhsachthongbaoComponent,
    DashboardChitietthongbaoComponent,
    DashboardThemthanhvienComponent,
    DashboardDanhsachsinhvienComponent,
    DashboardMainnhomComponent,
    DashbordDangkydetaiComponent,
    DashboardDanhsachdetaiComponent,
    DashboardLichbaocaoComponent,

    TestComponent,
    ScheduleComponent,
    MinistryThongkediemComponent,
  ],

  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,
    RouterModule,

    NgProgressModule,
    NgProgressHttpModule,
    PdfViewerModule,
    NgxPaginationModule,
    DpDatePickerModule,
    AutocompleteLibModule,

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
    HomeMainComponent,
    Location,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
