import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  
  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
      if(!(this.isLoggedIn$ && localStorage.getItem('role') == "Teacher")) {
        this.isLoggedIn$ = of(false);
        this.router.navigate(['/login']);
      }
  }
}
