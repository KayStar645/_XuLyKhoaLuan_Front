import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import axios from 'axios';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { shareService } from 'src/app/services/share.service';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { getParentElement } from 'src/assets/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ministry-danhsachthongbao',
  templateUrl: './ministry-danhsachthongbao.component.html',
  styleUrls: ['./ministry-danhsachthongbao.component.scss'],
})
export class MinistryDanhsachthongbaoComponent {
  @Input() searchName = '';
  @Input() isSelectedTB = false;
  @Output() returnIsSelectedTB = new EventEmitter<boolean>();
  listTB: any = [];
  selectedTB: string = 'adsad';
  root: ThongBao[] = [];
  lineTB = new ThongBao();
  elementOld: any;

  constructor(
    private thongBaoService: thongBaoService,
    private elementRef: ElementRef,
    private shareService: shareService
  ) {}

  async ngOnInit() {
    await this.getAllThongBao();
  }

  async getAllThongBao() {
    this.listTB = await this.thongBaoService.getAll();
    this.root = this.listTB;

    await Promise.all(
      this.listTB.map(async (tb: any) => {
        const hinhAnhResponse = await axios.get(
          environment.githubAPI + tb.hinhAnh
        );
        tb.hinhAnh = hinhAnhResponse.data.download_url;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listTB = this.root.filter((item) =>
      item.tenTb.toLowerCase().includes(searchName)
    );
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
