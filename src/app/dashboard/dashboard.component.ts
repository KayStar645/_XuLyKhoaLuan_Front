import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  
  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    if(!(this.isLoggedIn$ && localStorage.getItem('role') == "Student")) {
      this.isLoggedIn$ = of(false);
      this.router.navigate(['/login']);
    }
  }

}
