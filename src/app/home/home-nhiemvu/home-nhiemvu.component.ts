import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { HomeMainComponent } from '../home-main/home-main.component';

@Component({
  selector: 'app-home-phancong',
  templateUrl: './home-nhiemvu.component.html',
  styleUrls: ['./home-nhiemvu.component.scss'],
})
export class HomeNhiemvuComponent implements OnInit {
  isTruongBM: boolean = false;
  check: string = '';

  constructor(private titleService: Title) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách nhiệm vụ');

    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;
  }

  onChangeCurrent(event: any) {}

  onCheckIsAddBtnActive() {}

  onChangeInstruct(event: any) {}
}
