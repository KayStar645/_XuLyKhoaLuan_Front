import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  constructor(private authService: AuthService) { }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
}
