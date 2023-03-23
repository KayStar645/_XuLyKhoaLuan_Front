import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import 'dayjs/locale/vi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.navigate(['/login']);
    dayjs.locale('vi');
    // this.router.navigate(['/dashboard', 'dashboard-main']);
  }
}
