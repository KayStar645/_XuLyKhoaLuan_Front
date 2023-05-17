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
  @Input() max: number = 4;

  @Output() onParrentSelect = new EventEmitter();
  @Output() onParrentUnSelect = new EventEmitter();

  // Components
  temps: any[] = [];
  prevItem: any;
  prevItemIndexs: any[] = [];

  ngOnInit(): void {
    this.temps = this.items;

    window.addEventListener('click', (e) => {
      let parent = getParentElement(e.target, '.selected');
      let element = e.target as HTMLElement;
      let activeElement = element.closest('.selected-box');
      let activeList = document.querySelector('.selected.active');

      if (!parent && activeList && !activeElement) {
        activeList.classList.remove('active');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  onOpenDropdown(event: any) {
    let parent: HTMLElement = getParentElement(event.target, '.selected');

    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
    } else {
      document.querySelector('.selected.active')?.classList.remove('active');
      parent.classList.add('active');
      parent.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  isItemExist(selected: any[], item: any) {
    let result = selected.find(
      (t) => t[this.primarKey] === item[this.primarKey]
    )
      ? true
      : false;

    return result;
  }

  onSetItem(event: any) {
    let element = event.target.closest('.item');
    let id = element.dataset.id;
    let item = this.items.find((t) => t[this.primarKey].toString() === id);

    if (item) {
      let index = this.selectedItem.findIndex((t) => t[this.primarKey] === id);

      if (element.classList.contains('active')) {
        this.onParrentUnSelect.emit(this.selectedItem.splice(index, 1)[0]);
        element.classList.remove('active');
        this.prevItem = item;
      } else {
        if (this.isSearchMultiple) {
          element.classList.add('active');
          this.selectedItem.push(item);
        } else {
          if (this.selectedItem.length < 1) {
            this.selectedItem.push(item);
          } else {
            this.prevItem = this.selectedItem[0];
            this.selectedItem = [item];
          }

          document
            .querySelector('.selected.active')
            ?.classList.remove('active');
        }

        this.onParrentSelect.emit(item);
      }
    }
  }

  onSearchItem(event: any) {
    event.stopPropagation();
    let value = event.target.value;

    if (value.trim()) {
      this.temps = this.items.filter((t) => t[this.keyWord].includes(value));
    } else {
      this.temps = this.items;
    }
  }

  undoRemoveSelectedItem() {
    this.selectedItem.push(this.prevItem);
  }

  undoRemoveItem() {
    if (this.prevItem) {
      this.items.push(this.prevItem);
    }
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }

  handleToggleAdd() {}
}
