import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { DeTai } from 'src/app/models/DeTai.model';
import { Nhom } from 'src/app/models/Nhom.model';
import { congViecService } from 'src/app/services/congViec.service';
import { deTaiService } from 'src/app/services/deTai.service';
import { nhomService } from 'src/app/services/nhom.service';
import { getParentElement } from 'src/assets/utils';
import { HomeCongviecComponent } from '../home-congviec.component';

@Component({
  selector: 'app-home-danhsachbaitap',
  templateUrl: './home-danhsachbaitap.component.html',
  styleUrls: ['./home-danhsachbaitap.component.scss'],
})
export class HomeDanhsachbaitapComponent implements OnInit {
  maDT: string = '';
  nearTimeOutMS: any[] = [];
  listBT: CongViec[] = [];
  nhom: Nhom = new Nhom();
  deTai: DeTai = new DeTai();

  constructor(
    private deTaiService: deTaiService,
    private nhomService: nhomService,
    private congViecService: congViecService,
    private activeRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.activeRoute.paramMap.subscribe((params) => {
      this.maDT = params.get('maDt')!;
      if(this.maDT) {
        HomeCongviecComponent.maDT = params.get('maDt')!;
      }
      else {
        this.maDT = HomeCongviecComponent.maDT
      }
    });
    this.nhom = await this.nhomService.GetNhomByMadtAsync(this.maDT);
    this.listBT = await this.congViecService.GetCongviecByMadt(this.maDT);
    this.deTai = await this.deTaiService.getById(this.maDT);
  }

  onShowDetail(event: any) {
    let parent = getParentElement(event.target, '.list-item');
    let activeItem = document.querySelector('.list-item.active');

    if (activeItem) {
      activeItem.classList.remove('active');
    }
    if (parent) {
      parent.classList.add('active');
    }
    // if (parent && activeItem) {
    //   parent.classList.remove('active');
    // }
  }
}
