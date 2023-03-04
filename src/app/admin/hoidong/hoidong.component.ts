import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hoidong',
  templateUrl: './hoidong.component.html',
  styleUrls: ['./hoidong.component.scss']
})
export class HoidongComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Hội đồng');
  }

}
