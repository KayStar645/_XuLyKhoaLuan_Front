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
})
export class AdminComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  data = new GiaoVu('', '', '', '', '', '', '', '', '');
  list: GiaoVu[] = [];
  private id!: string;
  constructor(private authService: AuthService, private router: Router, private giaoVuService: giaoVuService) {}

  public ngOnInit(): void {


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
      this.data = data;
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
