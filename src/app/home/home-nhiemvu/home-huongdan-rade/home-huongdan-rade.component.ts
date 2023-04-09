import { huongDanService } from './../../../services/huongDan.service';
import { phanBienService } from './../../../services/phanBien.service';
import { raDeService } from 'src/app/services/raDe.service';
import { shareService } from 'src/app/services/share.service';
import { Component, OnInit } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement } from 'src/assets/utils';
import { GiangVien } from 'src/app/models/GiangVien.model';

@Component({
  selector: 'app-home-huongdan-rade',
  templateUrl: './home-huongdan-rade.component.html',
  styleUrls: ['./home-huongdan-rade.component.scss'],
})
export class HomeHuongdanRadeComponent implements OnInit {
  selectedGVPB: any = [];
  GVPBInputConfig: any = {};
  deTais: DeTai[] = [];
  sinhVienByDts: Record<string, SinhVien[]> = {};
  gvHuongdan: Record<string, GiangVien[]> = {};
  gvPhanbien: Record<string, GiangVien[]> = {};

  constructor(
    private deTaiService: deTaiService,
    private sinhVienService: sinhVienService,
    private huongDanService: huongDanService,
    private phanBienService: phanBienService
  ) {}

  async ngOnInit(): Promise<void> {
    this.GVPBInputConfig.data = [];

    window.addEventListener('click', (e) => {
      let parent = getParentElement(e.target, '.form-value');
      let activeList = document.querySelector('.selected-box.active');

      if (!parent && activeList) {
        activeList.classList.remove('active');
      }
    });

    this.deTais = await this.deTaiService.getDetaiByDot(
      shareService.namHoc,
      shareService.dot
    );

    this.deTais.forEach(async (dt) => {
      this.sinhVienByDts[dt.maDT] =
        await this.sinhVienService.getSinhvienByDetai(dt.maDT);
      this.gvHuongdan[dt.maDT] =
        await this.huongDanService.getGiangvienByDetai(dt.maDT);
      this.gvPhanbien[dt.maDT] =
        await this.phanBienService.getGiangvienByDetai(dt.maDT);
    });
  }

  onOpenDropdown(event: any) {
    let parent = getParentElement(event.target, '.form-value');

    document.querySelector('.selected-box.active')?.classList.remove('active');
    parent.querySelector('.selected-box').classList.toggle('active');
  }

  isCNExist(selectedGVPB: any, item: any) {}

  onSetItem(event: any) {}

  onSearchCN(event: any) {
    event.stopPropagation();
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }
}
