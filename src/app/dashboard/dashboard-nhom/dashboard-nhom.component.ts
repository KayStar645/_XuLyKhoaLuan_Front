import {
  Component,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { Router } from '@angular/router';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { DashboardComponent } from '../dashboard.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';

@Component({
  selector: 'app-dashboard-nhom',
  templateUrl: './dashboard-nhom.component.html',
  styleUrls: ['./dashboard-nhom.component.scss'],
})
export class DashboardNhomComponent {
  nhom: Nhom = new Nhom();
  deTai: DeTai = new DeTai();

  constructor(
    private nhomService: nhomService,
    private deTaiService: deTaiService
  ) {}

  @ViewChildren('link') links!: QueryList<ElementRef>;

  async ngOnInit() {
    this.nhom = await this.nhomService.getById(DashboardComponent.maNhom);
    this.deTai = await this.deTaiService.getById(DashboardComponent.maDT);
  }
}
