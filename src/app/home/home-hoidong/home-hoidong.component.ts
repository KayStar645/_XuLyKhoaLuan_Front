import { giangVienService } from 'src/app/services/giangVien.service';
import { Component, OnInit } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { Form } from 'src/assets/utils';

type InputConfigProp = {
  items?: GiangVien[];
  keyword?: string;
  selectedItem?: GiangVien[];
};

@Component({
  selector: 'app-home-hoidong',
  templateUrl: './home-hoidong.component.html',
  styleUrls: ['./home-hoidong.component.scss'],
})
export class HomeHoidongComponent implements OnInit {
  InputConfig: InputConfigProp = {};

  hoiDong: Form = new Form({});

  constructor(private giangVienService: giangVienService) {}

  async ngOnInit(): Promise<void> {
    this.InputConfig.items = await this.giangVienService.getAll();
    this.InputConfig.keyword = "tenGv";
    this.InputConfig.selectedItem = [];
  }

  onShowFormAdd() {}

  handleToggleAdd() {}

  addHoiDong() {}
}
