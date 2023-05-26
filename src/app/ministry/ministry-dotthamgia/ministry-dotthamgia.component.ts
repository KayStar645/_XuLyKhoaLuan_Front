import { MinistryDanhsachthamgiaComponent } from './ministry-danhsachthamgia/ministry-danhsachthamgia.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { thamGiaService } from './../../services/thamGia.service';
import { dotDkService } from './../../services/dotDk.service';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement, Option } from 'src/assets/utils';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-ministry-dotthamgia',
  styleUrls: ['./ministry-dotthamgia.component.scss'],
  templateUrl: './ministry-dotthamgia.component.html',
})
export class MinistryDotthamgiaComponent implements OnInit {
  constructor(
    private titleService: Title,
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên'); 
  }
  
}
