import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ministry-quanlychung',
  templateUrl: './ministry-quanlychung.component.html',
  styleUrls: ['./ministry-quanlychung.component.scss']
})
export class MinistryQuanlychungComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý chung');
  }

}
