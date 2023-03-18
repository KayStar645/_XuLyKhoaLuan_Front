import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../models/ChangePassword.model';
import { User } from '../models/User.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class userService {
    private apiUrl = environment.api;
    //private BaoCaos!: BehaviorSubject<BaoCao>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    async addMinistry(user: User): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Accounts/SigUpMinistry`, 
      user, this.shareService.httpOptions).toPromise();
    }

    async addTeacher(user: User): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Accounts/SigUpTeacher`, 
      user, this.shareService.httpOptions).toPromise();
    }

    async addStudent(user: User): Promise<any> {
      return await this.http.post(`${this.apiUrl}/api/Accounts/SigUpStudent`, 
      user, this.shareService.httpOptions).toPromise();
    }

    async delete(id: string) {
      return await this.http.delete(`${this.apiUrl}/api/Accounts/${id}`, 
      this.shareService.httpOptions).toPromise();
    }

    async ChangePassword(newUser: ChangePassword) {
      return await this.http.post(`${this.apiUrl}/api/Accounts/ChangePassword$`, 
      newUser, this.shareService.httpOptions).toPromise();
    }
}
