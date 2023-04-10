import { Title } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HomeMainComponent } from '../home-main/home-main.component';
import { homeNhiemVuService } from './home_nhiemvu.service';

@Component({
  selector: 'app-home-phancong',
  templateUrl: './home-nhiemvu.component.html',
  styleUrls: ['./home-nhiemvu.component.scss'],
  providers: [homeNhiemVuService],
})
export class HomeNhiemvuComponent implements OnInit {
  isTruongBM: boolean = false;
  check: string = '';

  constructor(
    private titleService: Title,
    public homeNhiemVuService: homeNhiemVuService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách nhiệm vụ');

    this.isTruongBM = HomeMainComponent.maBm == null ? false : true;
  }

  onChangeCurrent(event: any) {
    // this.onChangeLayout(event);
    this.homeNhiemVuService.setIsAddBtnActive(true);
  }

  onCheckIsAddBtnActive() {
    this.homeNhiemVuService.setIsAddBtnActive(false);
  }

  onChangeInstruct(event: any) {
    // this.onChangeLayout(event);
    this.homeNhiemVuService.setIsAddBtnActive(false);
  }

  // onChangeLayout(event: any) {
  //   // document.querySelector('.nav-item.active')?.classList.remove('active');

  //   // event.target.classList.add('active');
  // }
}
