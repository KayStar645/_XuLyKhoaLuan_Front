import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-danhsachgiangvien',
  templateUrl: './danhsachgiangvien.component.html',
  styleUrls: ['./danhsachgiangvien.component.scss']
})
export class DanhsachgiangvienComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách giảng viên');
  }

}
