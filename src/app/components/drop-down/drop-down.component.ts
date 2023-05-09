import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
})
export class DropDownComponent implements OnInit, OnChanges {
  // Params
  @Input() label: string = 'Tiêu đề';
  @Input() placeholder: string = 'Từ khóa';
  @Input() items: any[] = [];
  @Input() selectedItem: any[] = [];
  @Input() primarKey: any;
  @Input() keyWord: string = '';
  @Input() isSearchMultiple: boolean = true;
  @Input() isRow: boolean = true;

  @Output() onParrentSelect = new EventEmitter();
  @Output() onParrentUnSelect = new EventEmitter();

  // Components
  temp: any[] = [];
  prevItem: any;
  prevItemIndexs: any[] = [];

  ngOnInit(): void {
    window.addEventListener('click', (e) => {
      let parent = getParentElement(e.target, '.form-value');
      let activeList = document.querySelector('.form-value.active');

      if (!parent && activeList) {
        activeList.classList.remove('active');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.items = changes.items.currentValue;
    this.temp = changes.items.currentValue;
  }

  onOpenDropdown(event: any) {
    let parent: HTMLElement = getParentElement(event.target, '.form-value');

    document.querySelector('.form-value.active')?.classList.remove('active');
    parent.classList.add('active');
    parent.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  isItemExist(selected: any[], item: any) {
    return selected.find((t) => t[this.primarKey] === item[this.primarKey])
      ? true
      : false;
  }

  onSetItem(event: any) {
    let element = event.target;
    let id = element.dataset.id;
    let item = this.items.find((t) => t[this.primarKey] === id);
    let index = this.selectedItem.findIndex((t) => t[this.primarKey] === id);

    if (element.classList.contains('active')) {
      this.onParrentUnSelect.emit(this.selectedItem.splice(index, 1)[0]);
      element.classList.remove('active');
      this.prevItem = item;
    } else {
      if (this.isSearchMultiple) {
        this.selectedItem.push(item);
      } else {
        if (this.selectedItem.length < 1) {
          this.selectedItem.push(item);
        } else {
          this.selectedItem = [item];
        }
      }

      if (this.isSearchMultiple) element.classList.add('active');
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

  public undoRemoveItem() {
    this.selectedItem.push(this.prevItem);
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }
}
