import { GiaoVu } from './../models/GiaoVu.model';
import { giaoVuService } from './../services/giaoVu.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  template: `
    <p>Tên giáo vụ: {{ data?.TenGV }}</p>
    <p>Ngày sinh: {{ data?.NgaySinh }}</p>
    <p>Email: {{ data?.Email }}</p>
  `
})
export class AdminComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data = new GiaoVu('', '', '', '', '', '', '', '', '');
  list: GiaoVu[] = [];
  private id!: string;
  constructor(private authService: AuthService, private router: Router, private giaoVuService: giaoVuService) {}

  public ngOnInit(): void {
    // this.giaoVuService.getAll().subscribe((data) => {
    //   // console.log(data);
    //   // this.list = data;
    // })

    // this.id = "" + localStorage.getItem('Id')?.toString();

    // this.giaoVuService.getById(this.id).subscribe((data) => {
    //   this.data = data;
    //   console.log(this.data);
    //   // this.data = new GiaoVu(data.MaGV, data.TenGV, data.GioiTinh, data.NgaySinh, data.SDT,
    //   //   data.Email, data.NgayNhanViec, data.NgayNghi, data.MaKhoa);
    // });
    // console.log(this.data);
    // console.log(this.data.TenGV);

    this.isLoggedIn$ = this.authService.isLoggedIn();
    if(!(this.isLoggedIn$ && localStorage.getItem('role') == "Admin")) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    }
    else {
      this.isLoggedIn$ = of(true);
      this.router.navigate(['/']);
    }
  }

  onClick1() {
    this.id = "" + localStorage.getItem('Id')?.toString();

    this.giaoVuService.getById(this.id).subscribe((data) => {
      console.log('Data trả về: ')
      console.log(data)
      this.data = data;
      this.data = new GiaoVu(data.maGv, data.tenGv, data.gioiTinh, data.ngaySinh, data.sdt,
      data.email, data.ngayNhanViec, data.ngayNghi, data.maKhoa);
    });
    console.log(this.data);
  }

  onClick() {
    this.giaoVuService.getAll().subscribe((data) => {
      this.list = data;
    })
    console.log(this.list);
  }


}
