import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-quanlychung',
  templateUrl: './quanlychung.component.html',
  styleUrls: ['./quanlychung.component.scss']
})
export class QuanlychungComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý chung');
  }

}
