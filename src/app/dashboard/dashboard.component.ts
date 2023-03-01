import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

}
