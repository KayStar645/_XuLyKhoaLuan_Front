import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();

  constructor(private authService: AuthService) {}

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
}
