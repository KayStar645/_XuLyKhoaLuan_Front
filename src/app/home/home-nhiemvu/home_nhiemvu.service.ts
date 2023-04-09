import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class homeNhiemVuService {
  private isAddBtnACtive: boolean = true;

  public setIsAddBtnActive(value: boolean) {
    this.isAddBtnACtive = value;
  }

  public getIsAddBtnActive() {
    return this.isAddBtnACtive;
  }
}
