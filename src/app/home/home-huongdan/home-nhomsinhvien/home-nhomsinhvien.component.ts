import { huongDanService } from './../../../services/huongDan.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DeTai } from 'src/app/models/DeTai.model';
import { HomeMainComponent } from '../../home-main/home-main.component';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-home-nhomsinhvien',
  templateUrl: './home-nhomsinhvien.component.html',
  styleUrls: ['./home-nhomsinhvien.component.scss'],
})
export class HomeNhomsinhvienComponent {
  listDT: DeTai[] = [];

  constructor(
    private titleService: Title,
    private huongDanService: huongDanService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách đề tài hướng dẫn');

    // Chỉ lấy danh sách đề tài do giảng viên này hướng dẫn và đã có sinh viên đăng ký sau đợt đăng ký
    this.listDT = await this.huongDanService.GetDetaiByGVHDDotdk(
      HomeMainComponent.maGV,
      shareService.namHoc,
      shareService.dot
    );
  }
}
