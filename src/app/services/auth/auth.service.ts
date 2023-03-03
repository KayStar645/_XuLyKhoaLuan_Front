import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.api;
  

  constructor(private http: HttpClient, private router: Router) {}

  // Chạy được
  // add(giaoVu: GiaoVu): Observable<GiaoVu> {
  //   return this.http.post<GiaoVu>(`${this.apiUrl}/api/Giaovus`, giaoVu);
  // }

  public logIn(user: User, role: string) {

    localStorage.setItem('Id', user.Id)
    // localStorage.setItem('Password', user.Password)


    var login;
    if(role == 'Admin') {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInMinistry`, user);
    }
    else if(role == 'Teacher') {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInTeacher`, user);
    } else {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInStudent`, user);
    }

    localStorage.setItem('role', role);
    
    login.subscribe(
      (user) => {

      },
      (error) => {
        // console.log(error.error.text);
        localStorage.setItem('token', error.error.text)
      }
    );

    if(this.isLoggedIn()) {
      if(role === "Admin") {
        this.router.navigate(['/admin']);
      }
      else if (role === "Teacher") {
        this.router.navigate(['/home']);
      }
      else if(role === "Studnet") {
        this.router.navigate(['/dashboard']);
      }
    }

    return this.isLoggedIn();
  }

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): Observable<boolean> {

    const token = localStorage.getItem('token');
    if(token == "undefined" || token == null) {
      this.loggedIn.next(false);
    }
    else {
      this.loggedIn.next(true);
    }
    return this.loggedIn;
  }
}
