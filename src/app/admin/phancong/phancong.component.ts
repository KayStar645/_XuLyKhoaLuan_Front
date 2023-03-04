import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phancong',
  templateUrl: './phancong.component.html',
  styleUrls: ['./phancong.component.scss']
})
export class PhancongComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Phân công');
  }

}
