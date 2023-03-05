import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detai',
  templateUrl: './detai.component.html',
  styleUrls: ['./detai.component.scss']
})
export class DetaiComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách đề tài');
  }

}
