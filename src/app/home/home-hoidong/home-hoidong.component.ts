import { giangVienService } from 'src/app/services/giangVien.service';
import { Component, OnInit } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { Form } from 'src/assets/utils';
import { Validators } from '@angular/forms';

type InputConfigProp = {
  items: GiangVien[];
  keyword?: string;
  selectedItem: GiangVien[];
};

@Component({
  selector: 'app-home-hoidong',
  templateUrl: './home-hoidong.component.html',
  styleUrls: ['./home-hoidong.component.scss'],
})
export class HomeHoidongComponent implements OnInit {
  CTInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  TKInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };
  UVInputConfig: InputConfigProp = {
    items: [],
    selectedItem: [],
    keyword: 'tenGv',
  };

  hoiDong: Form = new Form({
    tenHd: ['', Validators.required],
    maHd: ['', Validators.required],
  });

  constructor(private giangVienService: giangVienService) {}

  async ngOnInit(): Promise<void> {
    this.CTInputConfig.items = await this.giangVienService.getAll();
    this.TKInputConfig.items = await this.giangVienService.getAll();
    this.UVInputConfig.items = await this.giangVienService.getAll();
  }

  onShowFormAdd() {
    document.documentElement.classList.add('no-scroll');
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.add('active');
    create.classList.add('active');
    this.hoiDong.resetForm('#create_box');
  }

  handleToggleAdd() {
    let createBox = document.querySelector('#create_box')!;
    let create = document.querySelector('#create')!;

    createBox.classList.remove('active');
    create.classList.remove('active');
    document.documentElement.classList.remove('no-scroll');
  }

  addHoiDong() {}

  onSelectCT($event: GiangVien) {
    let ctUVIndex = this.TKInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let ctTKIndex = this.UVInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.UVInputConfig.items?.splice(ctUVIndex, 1);
    this.TKInputConfig.items?.splice(ctTKIndex, 1);
  }
  onUnSelecCT($event: GiangVien) {
    this.UVInputConfig.items = [$event, ...this.UVInputConfig.items];
    this.TKInputConfig.items = [$event, ...this.TKInputConfig.items];
  }

  onSelectTK($event: GiangVien) {
    let tkCTIndex = this.CTInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let tkUVIndex = this.UVInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.CTInputConfig.items?.splice(tkCTIndex, 1);
    this.UVInputConfig.items?.splice(tkUVIndex, 1);
  }
  onUnSelectTK($event: GiangVien) {
    this.CTInputConfig.items = [$event, ...this.CTInputConfig.items];
    this.UVInputConfig.items = [$event, ...this.UVInputConfig.items];
  }

  onSelectUV($event: GiangVien) {
    let uvCTIndex = this.CTInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );
    let uvTKIndex = this.TKInputConfig.items.findIndex(
      (t) => t.maGv === $event.maGv
    );

    this.CTInputConfig.items?.splice(uvCTIndex, 1);
    this.TKInputConfig.items?.splice(uvTKIndex, 1);
  }
  onUnSelectUV($event: GiangVien) {
    this.CTInputConfig.items = [$event, ...this.CTInputConfig.items];
    this.TKInputConfig.items = [$event, ...this.TKInputConfig.items];
  }
}
