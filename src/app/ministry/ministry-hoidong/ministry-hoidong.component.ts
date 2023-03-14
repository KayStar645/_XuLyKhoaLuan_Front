import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ministry-hoidong',
  templateUrl: './ministry-hoidong.component.html',
  styleUrls: ['./ministry-hoidong.component.scss']
})
export class MinistryHoidongComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Hội đồng');
  }

}
