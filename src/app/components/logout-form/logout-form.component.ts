import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { Form } from 'src/assets/utils';

@Component({
   selector: 'app-logout-form',
   templateUrl: './logout-form.component.html',
   styleUrls: ['./logout-form.component.scss'],
})
export class LogoutFormComponent implements OnInit {
   @Input() show: boolean = false;
   @Output() onConfirm = new EventEmitter();
   @Output() onClose = new EventEmitter();

   reset = new Form({
      old: ['', Validators.required],
      new: ['', Validators.required],
      confirm: ['', Validators.required],
   });

   ngOnInit(): void {}

   onCloseForm() {
      this.onClose.emit(false);
   }

   onConfirmPassword() {
      this.reset.validate('.form');

      if (this.reset.form.valid) {
         this.onConfirm.emit(this.reset.form.value);
      }
   }
}
