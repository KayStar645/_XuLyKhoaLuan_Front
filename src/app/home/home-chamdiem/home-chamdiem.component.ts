import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { deTaiDiemService } from './../../services/NghiepVu/detaidiem.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';
import { HomeMainComponent } from '../home-main/home-main.component';

@Component({
  selector: 'app-home-chamdiem',
  templateUrl: './home-chamdiem.component.html',
  styleUrls: ['./home-chamdiem.component.scss'],
})
export class HomeChamdiemComponent {
  data: DeTaiDiemVT[] = [];
  len = 0;

  constructor(
    private titleService: Title,
    private deTaiDiemService: deTaiDiemService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Chấm điểm đề tài');
    this.data = await this.deTaiDiemService.GetDanhSachDiemByGv(
      HomeMainComponent.maGV
    );
    console.log(this.data);
  }
}
