import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kehoach',
  templateUrl: './kehoach.component.html',
  styleUrls: ['./kehoach.component.scss']
})
export class KehoachComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Kế hoạch');
  }

}
