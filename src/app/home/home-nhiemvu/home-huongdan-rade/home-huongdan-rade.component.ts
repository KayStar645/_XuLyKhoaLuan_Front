import { Component, OnInit } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-huongdan-rade',
  templateUrl: './home-huongdan-rade.component.html',
  styleUrls: ['./home-huongdan-rade.component.scss'],
})
export class HomeHuongdanRadeComponent implements OnInit {
  selectedGVPB: any = [];
  GVPBInputConfig: any = {};
  deTais: DeTai[] = [];
  sinhVienByDTs: any[] = [];

  constructor(private deTaiService: deTaiService) {}

  async ngOnInit(): Promise<void> {
    this.GVPBInputConfig.data = [];

    window.addEventListener('click', (e) => {
      let parent = getParentElement(e.target, '.form-value');
      let activeList = document.querySelector('.selected-box.active');

      if (!parent && activeList) {
        activeList.classList.remove('active');
      }
    });

    this.deTais = await this.deTaiService.getAll();
  }

  async getSinhVienByDT(maDT: string){
    await this.deTaiService.getSinhvienByDetai
  }

  onOpenDropdown(event: any) {
    let parent = getParentElement(event.target, '.form-value');

    document.querySelector('.selected-box.active')?.classList.remove('active');
    parent.querySelector('.selected-box').classList.toggle('active');
  }

  isCNExist(selectedGVPB: any, item: any) {}

  onSetItem(event: any) {}

  onSearchCN(event: any) {
    event.stopPropagation();
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }
}
