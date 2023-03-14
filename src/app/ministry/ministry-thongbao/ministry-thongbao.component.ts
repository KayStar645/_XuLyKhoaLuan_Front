import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ministry-thongbao',
  templateUrl: './ministry-thongbao.component.html',
  styleUrls: ['./ministry-thongbao.component.scss']
})
export class MinistryThongbaoComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Thông báo');
  }

}
