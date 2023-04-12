import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { congViecService } from 'src/app/services/congViec.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-danhsachbaitap',
  templateUrl: './home-danhsachbaitap.component.html',
  styleUrls: ['./home-danhsachbaitap.component.scss'],
})
export class HomeDanhsachbaitapComponent implements OnInit {
  maDT: string = '';
  nearTimeOutMS: any[] = [];
  listBT: CongViec[] = [];

  constructor(
    private congViecService: congViecService,
    private activeRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    // this.activeRoute.paramMap.subscribe((params) => {
    //   this.maDT = params.get('maDt')!;
    // });
    // await this.congViecService.getAll().then((data) => {
    //   this.listBT = data.filter((t) => t.maDt === this.maDT);
    // });
  }

  onShowDetail(event: any) {
    let parent = getParentElement(event.target, '.list-item');
    let activeItem = document.querySelector('.list-item.active');

    if (activeItem) {
      activeItem.classList.remove('active');
    }
    parent.classList.toggle('active');
  }
}
