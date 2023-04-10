import { MinistryDanhsachthamgiaComponent } from './ministry/ministry-dotthamgia/ministry-danhsachthamgia/ministry-danhsachthamgia.component';
import { MinistryDotthamgiaComponent } from './ministry/ministry-dotthamgia/ministry-dotthamgia.component';
import { HomeGiaobaitapComponent } from './home/home-giaobaitap/home-giaobaitap.component';
import { HomeThongbaoComponent } from './home/home-thongbao/home-thongbao.component';
import { HomeMainComponent } from './home/home-main/home-main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth/auth.guard';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardLoimoiComponent } from './dashboard/dashboard-loimoi/dashboard-loimoi.component';
import { DashboardThongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-thongbao.component';
import { MinistryComponent } from './ministry/ministry.component';
import { MinistryMainComponent } from './ministry/ministry-main/ministry-main.component';
import { MinistryThongbaoComponent } from './ministry/ministry-thongbao/ministry-thongbao.component';
import { MinistryKehoachComponent } from './ministry/ministry-kehoach/ministry-kehoach.component';
import { MinistryNhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-nhiemvu.component';
import { MinistryHoidongComponent } from './ministry/ministry-hoidong/ministry-hoidong.component';
import { MinistryDetaiComponent } from './ministry/ministry-detai/ministry-detai.component';
import { MinistryGiangvienComponent } from './ministry/ministry-giangvien/ministry-giangvien.component';
import { MinistrySinhvienComponent } from './ministry/ministry-sinhvien/ministry-sinhvien.component';
import { MinistryQuanlychungComponent } from './ministry/ministry-quanlychung/ministry-quanlychung.component';
import { HomeKehoachComponent } from './home/home-kehoach/home-kehoach.component';
import { HomeGiangvienComponent } from './home/home-giangvien/home-giangvien.component';
import { HomeDetaiComponent } from './home/home-detai/home-detai.component';
import { HomeSinhvienComponent } from './home/home-sinhvien/home-sinhvien.component';
import { HomeHoidongComponent } from './home/home-hoidong/home-hoidong.component';
import { HomeLichphanbienComponent } from './home/home-lichphanbien/home-lichphanbien.component';
import { HomeDanhsachgiangvienComponent } from './home/home-giangvien/home-danhsachgiangvien/home-danhsachgiangvien.component';
import { MinistryDanhsachgiangvienComponent } from './ministry/ministry-giangvien/ministry-danhsachgiangvien/ministry-danhsachgiangvien.component';
import { MinistryDanhsachsinhvienComponent } from './ministry/ministry-sinhvien/ministry-danhsachsinhvien/ministry-danhsachsinhvien.component';
import { HomeDanhsachdetaiComponent } from './home/home-detai/home-danhsachdetai/home-danhsachdetai.component';
import { HomeDanhsachsinhvienComponent } from './home/home-sinhvien/home-danhsachsinhvien/home-danhsachsinhvien.component';
import { HomeNhiemvuComponent } from './home/home-nhiemvu/home-nhiemvu.component';
import { MinistryDanhsachthongbaoComponent } from './ministry/ministry-thongbao/ministry-danhsachthongbao/ministry-danhsachthongbao.component';
import { MinistryChitietthongbaoComponent } from './ministry/ministry-thongbao/ministry-chitietthongbao/ministry-chitietthongbao.component';
import { MinistryDanhsachnhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-danhsachnhiemvu/ministry-danhsachnhiemvu.component';
import { MinistryChitietnhiemvuComponent } from './ministry/ministry-nhiemvu/ministry-chitietnhiemvu/ministry-chitietnhiemvu.component';
import { HomeDanhsachnhiemvuComponent } from './home/home-nhiemvu/home-danhsachnhiemvu/home-danhsachnhiemvu.component';
import { HomeChitietnhiemvuComponent } from './home/home-nhiemvu/home-chitietnhiemvu/home-chitietnhiemvu.component';
import { MinistryDanhsachkehoachComponent } from './ministry/ministry-kehoach/ministry-danhsachkehoach/ministry-danhsachkehoach.component';
import { MinistryChitietkehoachComponent } from './ministry/ministry-kehoach/ministry-chitietkehoach/ministry-chitietkehoach.component';
import { DashboardNhomComponent } from './dashboard/dashboard-nhom/dashboard-nhom.component';
import { DashboardTrangchunhomComponent } from './dashboard/dashboard-nhom/dashboard-trangchunhom/dashboard-trangchunhom.component';
import { DashboardThanhviennhomComponent } from './dashboard/dashboard-nhom/dashboard-thanhviennhom/dashboard-thanhviennhom.component';
import { DashboardBaitapnhomComponent } from './dashboard/dashboard-nhom/dashboard-baitapnhom/dashboard-baitapnhom.component';
import { MinistryDanhsachdetaiComponent } from './ministry/ministry-detai/ministry-danhsachdetai/ministry-danhsachdetai.component';
import { MinistryChitietdetaiComponent } from './ministry/ministry-detai/ministry-chitietdetai/ministry-chitietdetai.component';
import { HomeChitietdetaiComponent } from './home/home-detai/home-chitietdetai/home-chitietdetai.component';
import { HomeDanhsachkehoachComponent } from './home/home-kehoach/home-danhsachkehoach/home-danhsachkehoach.component';
import { HomeChitietkehoachComponent } from './home/home-kehoach/home-chitietkehoach/home-chitietkehoach.component';
import { DashboardDetaiComponent } from './dashboard/dashboard-detai/dashboard-detai.component';
import { HomeFormdetaiComponent } from './home/home-detai/home-formdetai/home-formdetai.component';
import { HomeHuongdanRadeComponent } from './home/home-nhiemvu/home-huongdan-rade/home-huongdan-rade.component';
import { HomeDanhsachthongbaoComponent } from './home/home-thongbao/home-danhsachthongbao/home-danhsachthongbao.component';
import { HomeChitietthongbaoComponent } from './home/home-thongbao/home-chitietthongbao/home-chitietthongbao.component';
import { DashboardDanhsachthongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-danhsachthongbao/dashboard-danhsachthongbao.component';
import { DashboardChitietthongbaoComponent } from './dashboard/dashboard-thongbao/dashboard-chitietthongbao/dashboard-chitietthongbao.component';
import { DashboardBaitapchitietComponent } from './dashboard/dashboard-nhom/dashboard-baitapchitiet/dashboard-baitapchitiet.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'ministry',
    component: MinistryComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MinistryMainComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'thong-bao',
        component: MinistryThongbaoComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: MinistryDanhsachthongbaoComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: MinistryChitietthongbaoComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'ke-hoach',
        component: MinistryKehoachComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: MinistryDanhsachkehoachComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: MinistryChitietkehoachComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'nhiem-vu',
        component: MinistryNhiemvuComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: MinistryDanhsachnhiemvuComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: MinistryChitietnhiemvuComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'hoi-dong',
        component: MinistryHoidongComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'de-tai',
        component: MinistryDetaiComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: MinistryDanhsachdetaiComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: MinistryChitietdetaiComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        component: MinistryGiangvienComponent,
        path: 'giang-vien',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'danh-sach-giang-vien',
            component: MinistryDanhsachgiangvienComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        component: MinistrySinhvienComponent,
        path: 'sinh-vien',
        children: [
          {
            path: 'danh-sach-sinh-vien',
            component: MinistryDanhsachsinhvienComponent,
            canActivate: [AuthGuard],
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        component: MinistryDotthamgiaComponent,
        path: 'tham-gia',
        children: [
          {
            path: 'danh-sach-tham-gia',
            component: MinistryDanhsachthamgiaComponent,
            canActivate: [AuthGuard],
          },
        ],
        canActivate: [AuthGuard],
      },
      {
        path: 'quan-ly-chung',
        component: MinistryQuanlychungComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  //======================================================================================
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeMainComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'thong-bao',
        component: HomeThongbaoComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: HomeDanhsachthongbaoComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: HomeChitietthongbaoComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'ke-hoach',
        component: HomeKehoachComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: HomeDanhsachkehoachComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: HomeChitietkehoachComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'nhiem-vu',
        component: HomeNhiemvuComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: HomeDanhsachnhiemvuComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: HomeChitietnhiemvuComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'huongdan-rade',
            component: HomeHuongdanRadeComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'giang-vien',
        component: HomeGiangvienComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'danh-sach-giang-vien',
            component: HomeDanhsachgiangvienComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'thong-bao',
        component: HomeThongbaoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'de-tai',
        component: HomeDetaiComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: HomeDanhsachdetaiComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: HomeChitietdetaiComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'form',
            component: HomeFormdetaiComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'sinh-vien',
        component: HomeSinhvienComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'danh-sach-sinh-vien',
            component: HomeDanhsachsinhvienComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'hoi-dong',
        component: HomeHoidongComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'giao-bai-tap',
        component: HomeGiaobaitapComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'lich-phan-bien',
        component: HomeLichphanbienComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  //======================================================================================
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardMainComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'loi-moi',
        component: DashboardLoimoiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'thong-bao',
        component: DashboardThongbaoComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: DashboardDanhsachthongbaoComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'chi-tiet',
            component: DashboardChitietthongbaoComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'nhom',
        component: DashboardNhomComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: DashboardTrangchunhomComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'thanh-vien',
            component: DashboardThanhviennhomComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'bai-tap',
            component: DashboardBaitapnhomComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'bai-tap-chi-tiet',
            component: DashboardBaitapchitietComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'de-tai',
        component: DashboardDetaiComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
