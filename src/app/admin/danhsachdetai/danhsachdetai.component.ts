import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-danhsachdetai',
  templateUrl: './danhsachdetai.component.html',
  styleUrls: ['./danhsachdetai.component.scss']
})
export class DanhsachdetaiComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách đề tài');
  }

}
