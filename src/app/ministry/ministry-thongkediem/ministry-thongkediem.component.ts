import { dotDkService } from './../../services/dotDk.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { Component, ViewChild } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DotDk } from 'src/app/models/DotDk.model';
import { MinistryDanhsachdiemComponent } from './ministry-thongkediem/ministry-danhsachdiem.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ministry-thongkediem',
  templateUrl: './ministry-thongkediem.component.html',
})
export class MinistryThongkediemComponent {
  @ViewChild(MinistryDanhsachdiemComponent)
  protected DSDComponent!: MinistryDanhsachdiemComponent;
  keyword: string = '';
  listCN: ChuyenNganh[] = [];
  listDotdk: DotDk[] = [];

  private keywordChanged = new Subject<string>();

  constructor(
    private chuyenNganhService: chuyenNganhService,
    private dotDkService: dotDkService
  ) {}

  async ngOnInit() {
    this.listCN = await this.chuyenNganhService.getAll();
    this.listDotdk = await this.dotDkService.getAll();

    this.keywordChanged.pipe(debounceTime(500)).subscribe(async (keyword) => {
      await this.DSDComponent.updateData(keyword);
    });
  }

  handleInputChange(event: any) {
    const keyword = event;
    this.keywordChanged.next(keyword);
  }

  onExportList() {}

  onChangeCn(event: any) {
    const maCn = event.target.value;
    this.DSDComponent.getSinhVienByMaCN(maCn);
  }

  onChangeDotdk(event: any) {
    const dotdk = event.target.value;
    this.DSDComponent.getSinhVienByDotdk(dotdk);
  }
}
