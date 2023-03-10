import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Nhom } from 'src/app/models/Nhom.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { nhomService } from 'src/app/services/nhom.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { Form } from 'src/assets/utils';
import { shareService } from '../../services/share.service';

@Component({
  selector: 'app-dashboard-loimoi',
  templateUrl: './dashboard-loimoi.component.html',
  styleUrls: ['./dashboard-loimoi.component.scss']
})
export class DashboardLoimoiComponent implements OnInit{
  title = 'Gửi lời mời nhóm';
  public isLoggedIn$: Observable<boolean> = new Observable<boolean>();
  public isFindedStudent$: Observable<boolean> = new Observable<boolean>();
  invitationForm: any;
  studentInfo: any;
  data: any = SinhVien;
  lstNhom: any;
  form = new Form({
    studentId: ['', Validators.required],
  });
  MAX_IN_GROUP: number = 3;
  idSentStudent: any;
  maxId: number = 0;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private sinhVienService: sinhVienService,
    private nhomService: nhomService,
    private route: ActivatedRoute,
    private shareService: shareService
  ) {
    this.invitationForm = this.form.form;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.idSentStudent = params.id);
  }

  findSvById(event: any) {
    var maSv = this.invitationForm.value['studentId'];

    this.sinhVienService.getById(maSv).subscribe(data => {
      if(data == null)
        console.log("Không tồn tại sinh viên");
      else{
        this.data = data;
        const formStudentInfo =
      this.elementRef.nativeElement.querySelector('#form-student-info');
      formStudentInfo.style.display = 'block';
      }
    });
  }

  sendInvitation(event: any){
    
  }

  dateFormat(str: any): string {
    return this.shareService.dateFormat(str);
  }
}
