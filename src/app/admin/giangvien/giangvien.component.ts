import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-giangvien',
  templateUrl: './giangvien.component.html',
  styleUrls: ['./giangvien.component.scss']
})
export class GiangvienComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách giảng viên');
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']);

  }

}
