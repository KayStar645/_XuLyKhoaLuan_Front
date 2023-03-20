import { HomeDanhsachgiangvienComponent } from './home-danhsachgiangvien/home-danhsachgiangvien.component';
import { BoMon } from '../../models/BoMon.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-giangvien',
  templateUrl: './home-giangvien.component.html',
  // styleUrls: ['./home-giangvien.component.scss']
})
export class HomeGiangvienComponent implements OnInit {
  @ViewChild(HomeDanhsachgiangvienComponent)
  listBoMon: BoMon[] = [];
  searchName = '';

  constructor(
    private titleService: Title,
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách giảng viên');
  }
}
