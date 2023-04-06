import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ministry-kehoach',
  templateUrl: './ministry-kehoach.component.html',
  styleUrls: [],
})
export class MinistryKehoachComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Kế hoạch');
  }
}
