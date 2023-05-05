import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { shareService } from 'src/app/services/share.service';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Router } from '@angular/router';
import { LoiMoi } from 'src/app/models/LoiMoi.model';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { nhomService } from 'src/app/services/nhom.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { Title } from '@angular/platform-browser';
import { DashboardComponent } from '../../dashboard.component';
import { format } from 'date-fns';
import { Nhom } from 'src/app/models/Nhom.model';
import { ThamGia } from 'src/app/models/ThamGia.model';

@Component({
  selector: 'app-dashboard-danhsachthongbao',
  templateUrl: './dashboard-danhsachthongbao.component.html',
  styleUrls: [
    './dashboard-danhsachthongbao.component.scss',
    '../dashboard-thongbao.component.scss',
  ],
})
export class DashboardDanhsachthongbaoComponent {
  title = 'Thông báo';
  maSv: string = '';
  lstLoiMoi: LoiMoi[] = [];
  isAccept = false;
  isConfirmDialogVisible = false;
  loiMoi: any;
  isTeamLeader = false;
  isGroupHaveOneMember = false;
  isPopupVisible = false;
  lstNhom: Nhom[] = [];
  listThamGia: ThamGia[] = [];

  // Thông báo từ khoa
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
    private websocketService: WebsocketService,
    private router: Router,
    private loiMoiService: loiMoiService,
    private thamGiaService: thamGiaService,
    private cd: ChangeDetectorRef,
    private nhomService: nhomService
  ) {}

  async ngOnInit() {
    await this.getAllThongBao();

    this.maSv = DashboardComponent.maSV;
    this.getAllLoiMoi();
    if (
      await this.thamGiaService.isJoinedAGroup(
        DashboardComponent.maSV,
        shareService.namHoc,
        shareService.dot
      )
    ) {
      const groupJoinedId = await (
        await this.thamGiaService.getById(
          this.maSv,
          shareService.namHoc,
          shareService.dot
        )
      ).maNhom;
      this.isGroupHaveOneMember =
        (await this.thamGiaService.getAll()).filter(
          (tg) => tg.maNhom == groupJoinedId
        ).length === 1;
    } else {
      this.router.navigate(['dashboard']);
    }

    this.websocketService.startConnection();
    this.websocketService.receiveFromThongBao((dataChange: boolean) => {
      if (dataChange) {
        this.getAllThongBao();
      }
    });
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.getAllThamGia();
      }
    });
    this.lstNhom = await this.nhomService.getAll();
  }

  async getAllThamGia() {
    this.listThamGia = await this.thamGiaService.GetThamgiaByDotdk(
      shareService.namHoc,
      shareService.dot
    );
  }

  async getAllLoiMoi() {
    await this.loiMoiService
      .getAllLoiMoiSinhVienByIdDotNamHoc(
        this.maSv,
        shareService.namHoc,
        shareService.dot
      )
      .then((data) => {
        data = data.map((loiMoi) => {
          return {
            ...loiMoi,
            thoiGian: format(new Date(loiMoi.thoiGian), 'dd-MM-yyyy'),
          };
        });

        this.lstLoiMoi = data;
      });
  }

  // Thông báo từ lời mời nè
  async acceptInvitation(loiMoi: LoiMoi) {
    if (DashboardComponent.isSignUpDeTai) {
      this.isPopupVisible = true;
      return;
    }

    let groupIdCreated = await (
      await this.thamGiaService.getById(
        DashboardComponent.maSV,
        shareService.namHoc,
        shareService.dot
      )
    ).maNhom;
    var thamGia = await this.thamGiaService.getById(
      loiMoi.maSv,
      shareService.namHoc,
      shareService.dot
    );
    if (groupIdCreated !== null && groupIdCreated !== '') {
      this.isConfirmDialogVisible = true;
      this.isTeamLeader = thamGia.truongNhom;
      this.loiMoi = loiMoi;
    }
    this.cd.detectChanges();
  }

  //Phải click 2 lần mới cập nhật được phần đã xóa
  async rejectInvitation(loiMoi: LoiMoi) {
    await this.loiMoiService.delete(
      loiMoi.maNhom,
      loiMoi.maSv,
      loiMoi.namHoc,
      loiMoi.dot
    );
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(
      this.maSv,
      shareService.namHoc,
      shareService.dot
    );
    this.cd.detectChanges();
  }

  async showConfirmDialog() {
    this.isConfirmDialogVisible = true;
  }

  hideConfirmDialog() {
    this.isConfirmDialogVisible = false;
  }

  async performAction() {
    this.isConfirmDialogVisible = false;
    var thamGia = await this.thamGiaService.getById(
      this.loiMoi.maSv,
      shareService.namHoc,
      shareService.dot
    );
    if (thamGia.truongNhom && !this.isGroupHaveOneMember) {
      this.router.navigate(['dashboard/nhom/thanh-vien']);
      return;
    } else if (thamGia.truongNhom && this.isGroupHaveOneMember) {
      let tgia = await this.thamGiaService.getById(
        this.maSv,
        shareService.namHoc,
        shareService.dot
      );
      //Xóa tất cả lời mời từ nhóm cũ
      const lstLoiMoi =
        await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(
          tgia.maNhom,
          shareService.namHoc,
          shareService.dot
        );
      (await lstLoiMoi).forEach((lm) =>
        this.loiMoiService.delete(lm.maNhom, lm.maSv, lm.namHoc, lm.dot)
      );
      //Xóa nhóm
      await this.nhomService.delete(tgia.maNhom);
    }
    thamGia.maNhom = this.loiMoi.maNhom;
    thamGia.truongNhom = false;
    await this.thamGiaService.update(thamGia);
    this.websocketService.sendForThamGia(true);

    //Cập nhật lại danh sách lời mời
    await this.loiMoiService.delete(
      this.loiMoi.maNhom,
      this.loiMoi.maSv,
      this.loiMoi.namHoc,
      this.loiMoi.dot
    );
    this.lstLoiMoi = await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHoc(
      this.maSv,
      shareService.namHoc,
      shareService.dot
    );
    this.cd.detectChanges();
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  // Thông báo từ khoa
  async getAllThongBao() {
    this.listTB = await this.thongBaoService.getAll();
    this.root = this.listTB;
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }

  getTenNhomByMaNhom(maNhom: string) {
    return this.lstNhom.find((nhom) => nhom.maNhom == maNhom)?.tenNhom;
  }
}
