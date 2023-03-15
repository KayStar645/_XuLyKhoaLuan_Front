import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ministry-phancong',
  templateUrl: './ministry-phancong.component.html',
  styleUrls: ['./ministry-phancong.component.scss']
})
export class MinistryPhancongComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Phân công');
  }

}
