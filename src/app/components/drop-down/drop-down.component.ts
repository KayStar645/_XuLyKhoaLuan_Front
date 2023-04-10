import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
})
export class DropDownComponent implements OnInit {
  // Params
  @Input() label: string = 'Tiêu đề';
  @Input() placeholder: string = 'Từ khóa';
  @Input() items: any[] = [];
  @Input() selectedItem: any[] = [];
  @Input() primarKey: any;
  @Input() keyWord: string = '';

  @Output() onParrentSelect = new EventEmitter();
  @Output() onParrentUnSelect = new EventEmitter();

  // Components
  temp: any[] = [];

  ngOnInit(): void {
    this.temp = this.items;

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
    parent.querySelector('.selected-box').classList.add('active');
  }

  isItemExist(selected: any[], item: any) {
    return selected.find((t) => t[this.primarKey] === item[this.primarKey])
      ? true
      : false;
  }

  onSetItem(event: any) {
    let element = event.target;
    let id = element.dataset.id;

    if (element.classList.contains('active')) {
      let index = this.selectedItem.findIndex((t) => t[this.primarKey] === id);
      this.onParrentUnSelect.emit(this.items[index]);

      element.classList.remove('active');

      this.selectedItem.splice(index, 1);
    } else {
      let item = this.items.find((t) => t[this.primarKey] === id);
      this.selectedItem.push({
        ...item,
      });

      element.classList.add('active');
      this.onParrentSelect.emit(item);
    }
  }

  onSearchItem(event: any) {
    event.stopPropagation();
    let value = event.target.value;

    if (value.trim()) {
      this.items = this.items.filter((t) => t[this.keyWord].includes(value));
    } else {
      this.items = this.temp;
    }
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }
}
