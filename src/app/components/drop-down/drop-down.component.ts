import {
   Component,
   EventEmitter,
   forwardRef,
   Input,
   OnInit,
   Output,
} from '@angular/core';
import { getParentElement } from 'src/assets/utils';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
   selector: 'app-drop-down',
   templateUrl: './drop-down.component.html',
   styleUrls: ['./drop-down.component.scss'],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => DropDownComponent),
         multi: true,
      },
   ],
})
export class DropDownComponent implements OnInit, ControlValueAccessor {
   // Params
   @Input() label: string = 'Tiêu đề';
   @Input() placeholder: string = 'Từ khóa';
   @Input() items: any[] = [];
   @Input() selectedItem: any[] = [];
   @Input() primaryKey: any;
   @Input() keyWord: string = '';
   @Input() isSearchMultiple: boolean = true;
   @Input() isRow: boolean = true;
   @Input() max: number = 4;
   @Input() name: string = '';
   @Input() disabled: boolean = false;

   @Output() onParentSelect = new EventEmitter();
   @Output() onParentUnSelect = new EventEmitter();

   // Components
   temps: any[] = [];
   prevItem: any;
   value: string = '';
   onChange!: (value: string) => void;

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

   onOpenDropdown(event: any) {
      let parent: HTMLElement = getParentElement(event.target, '.selected');

      console.log(this.disabled);

      if (!this.disabled) {
         if (parent.classList.contains('active')) {
            parent.classList.remove('active');
         } else {
            document
               .querySelector('.selected.active')
               ?.classList.remove('active');
            parent.classList.add('active');
            parent.scrollIntoView({
               behavior: 'smooth',
               block: 'center',
            });
         }
      }
   }

   isItemExist(selected: any[], item: any) {
      return !!selected.find(
         (t) => t[this.primaryKey] === item[this.primaryKey]
      );
   }

   onSetItem(event: any) {
      let element = event.target.closest('.item');
      let id = element.dataset.id;
      let item = this.items.find((t) => t[this.primaryKey].toString() === id);

      if (item) {
         let index = this.selectedItem.findIndex(
            (t) => t[this.primaryKey] === id
         );

         if (element.classList.contains('active')) {
            this.onParentUnSelect.emit(this.selectedItem.splice(index, 1)[0]);
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

            this.onParentSelect.emit(item);
         }

         this.value = JSON.stringify(
            this.selectedItem.map((t) => t[this.primaryKey])
         );
         if (this.selectedItem.length === 0) {
            this.value = '';
         }
         this.onChange(this.value);
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

   writeValue(obj: any): void {
      this.value = obj;
   }

   registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   registerOnTouched(fn: any): void {}

   setDisabledState?(isDisabled: boolean): void {}
}
