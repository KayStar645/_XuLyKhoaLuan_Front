import { ThongbaoComponent } from './admin/thongbao/thongbao.component';
import { KehoachComponent } from './admin/kehoach/kehoach.component';
import { DetaiComponent } from './admin/detai/detai.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth/auth.guard';
import { SinhvienComponent } from './admin/sinhvien/sinhvien.component';
import { HoidongComponent } from './admin/hoidong/hoidong.component';
import { PhancongComponent } from './admin/phancong/phancong.component';
import { QuanlychungComponent } from './admin/quanlychung/quanlychung.component';
import { GiangvienComponent } from './admin/giangvien/giangvien.component';
import { DanhsachgiangvienComponent } from './admin/giangvien/danhsachgiangvien/danhsachgiangvien.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    component: AdminComponent, 
    path: 'admin',
    children: [
      { path: 'admin-main', component: AdminMainComponent, /* canActivate: [AuthGuard] */},
      { path: 'thong-bao', component: ThongbaoComponent, /* canActivate: [AuthGuard] */},
      { path: 'ke-hoach', component: KehoachComponent, /* canActivate: [AuthGuard] */},
      { path: 'phan-cong', component: PhancongComponent, /* canActivate: [AuthGuard] */},
      { path: 'hoi-dong', component: HoidongComponent, /* canActivate: [AuthGuard] */},
      { path: 'de-tai', component: DetaiComponent, /* canActivate: [AuthGuard] */},
      { 
        component: GiangvienComponent,
        path: 'giang-vien',
        children: [
          {path: 'danh-sach-giang-vien', component: DanhsachgiangvienComponent, /* canActivate: [AuthGuard] */},
        ]
      },
      { path: 'sinh-vien', component: SinhvienComponent, /* canActivate: [AuthGuard] */},
      { path: 'quan-ly-chung', component: QuanlychungComponent, /* canActivate: [AuthGuard] */},
    ],
    canActivate: [AuthGuard] 
  },


  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },


  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
