import { shareService } from './../share.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/User.model';
import { newUser } from 'src/app/models/newUser.model';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   private apiUrl = environment.api;

   constructor(
      private http: HttpClient,
      private router: Router,
      private shareService: shareService
   ) {}

   async logIn(user: User) {
      return await this.http.post<any>(
         `${this.apiUrl}/api/Accounts/SigIn`,
         user,
         this.shareService.httpOptions
      ).toPromise();
   }

   public logOut() {
      window.location.href = window.location.origin + '/login';

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('Id');

      this.loggedIn.next(false);
   }

   public isLoggedIn(): Observable<boolean> {
      const token = localStorage.getItem('token');
      if (token == 'undefined' || token == null) {
         this.loggedIn.next(false);
      } else {
         this.loggedIn.next(true);
      }
      return this.loggedIn;
   }

   async changePassword(user: newUser): Promise<any> {
      return (await this.http.post<any>(
         `${this.apiUrl}/api/Accounts/ChangePassword`,
         user,
         this.shareService.httpOptions
      )).toPromise();
   }
}
