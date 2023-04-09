import { Component, OnInit } from '@angular/core';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-huongdan-rade',
  templateUrl: './home-huongdan-rade.component.html',
  styleUrls: ['./home-huongdan-rade.component.scss'],
})
export class HomeHuongdanRadeComponent implements OnInit {
  selectedGVPB: any = [];
  GVPBInputConfig: any = {};

  constructor() {}

  ngOnInit(): void {
    this.GVPBInputConfig.data = [];

    window.addEventListener('click', (e) => {
      let parent = getParentElement(e.target, '.form-value');
      let activeList = document.querySelector('.selected-box.active');

      if (!parent && activeList) {
        activeList.classList.remove('active');
      }
    });
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
