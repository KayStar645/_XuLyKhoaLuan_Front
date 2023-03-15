import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ministry-phancong',
  templateUrl: './ministry-nhiemvu.component.html',
  styleUrls: ['./ministry-nhiemvu.component.scss']
})
export class MinistryNhiemvuComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Phân công');
  }

}
