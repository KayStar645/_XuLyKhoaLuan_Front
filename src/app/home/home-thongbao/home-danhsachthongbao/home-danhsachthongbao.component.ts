import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { shareService } from 'src/app/services/share.service';
import { thongBaoService } from 'src/app/services/thongBao.service';

@Component({
  selector: 'app-home-danhsachthongbao',
  templateUrl: './home-danhsachthongbao.component.html',
  styleUrls: [
    './home-danhsachthongbao.component.scss',
    '../home-thongbao.component.scss',
  ],
})
export class HomeDanhsachthongbaoComponent {
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
    private shareService: shareService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    await this.getAllThongBao();

    this.websocketService.startConnection();
    this.websocketService.receiveFromThongBao((dataChange: boolean) => {
      if (dataChange) {
        this.getAllThongBao();
      }
    });
  }

  async getAllThongBao() {
    this.listTB = await this.thongBaoService.getAll();
    this.root = this.listTB;
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
