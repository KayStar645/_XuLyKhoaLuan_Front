import { thamGiaService } from './../../../services/thamGia.service';
import { ThamGia } from './../../../models/ThamGia.model';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { Form, getParentElement } from 'src/assets/utils';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Validators } from '@angular/forms';
import { DashboardComponent } from '../../dashboard.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { loiMoiService } from 'src/app/services/loiMoi.service';
import { LoiMoi } from 'src/app/models/LoiMoi.model';

@Component({
  selector: 'app-dashboard-danhsachsinhvien',
  templateUrl: './dashboard-danhsachsinhvien.component.html',
  styleUrls: ['../dashboard-themthanhvien.component.scss'],
})
export class DashboardDanhsachsinhvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedTG = false;
  @Output() returnIsSelectedTG = new EventEmitter<boolean>();
  listTg: any[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();
  groupIdCreated = '';
  lstLoiMoi: LoiMoi[] = [];

  isNotHaveStudent = false;
  isSignUpDeTai = false;
  isPopupVisible = false;
  isSentToNotJoinStudent = false;
  showSuccessMessage = false;
  showGroupMemberAlreadySent = false;
  isRemoveInvite = false;

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  selectedTG: any[] = [];
  lineTG = new ThamGia();
  elementOld: any;
  lmForm: Form = new Form({
    loiNhan: [
      'Bạn có muốn tham gia vào nhóm của mình không ?',
      Validators.required,
    ],
  });

  constructor(
    private sinhVienService: sinhVienService,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
    private thamGiaService: thamGiaService,
    private websocketService: WebsocketService,
    private nhomService: nhomService,
    private loiMoiService: loiMoiService
  ) {}

  async ngOnInit() {
    this.listSV = await this.sinhVienService.getAll();
    this.getAllThamgiaByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();

    this.websocketService.startConnection();
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.sinhVienService.getAll().then((data) => (this.listSV = data));
        this.getAllThamgiaByDotdk();
      }
    });

    this.lstLoiMoi =
      await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(
        DashboardComponent.maNhom,
        shareService.namHoc,
        shareService.dot
      );
  }

  onShowInvite(maSv: string) {
    let create = document.querySelector('#create');
    let createBox = document.querySelector('#create_box');

    create?.classList.add('active');
    createBox?.classList.add('active');
    this.getSinhVienById(maSv);
  }

  onHideInvite(event: any) {
    event.target.classList.remove('active');
    document.querySelector('#create_box')?.classList.remove('active');
  }

  async onSendInvite() {
    let create = document.querySelector('#create');
    let createBox = document.querySelector('#create_box');
    this.isNotHaveStudent = false;
    this.isSignUpDeTai = false;
    this.isPopupVisible = false;
    this.isSentToNotJoinStudent = false;
    this.showSuccessMessage = false;
    this.showGroupMemberAlreadySent = false;

    //Xuất ra lỗi khi nhóm đã đăng ký đề tài
    if (DashboardComponent.isSignUpDeTai) {
      this.isSignUpDeTai = true;
      create?.classList.remove('active');
      createBox?.classList.remove('active');
      this.isPopupVisible = true;
      return;
    }

    const result = await this.thamGiaService.isNotJoinedAGroupThisSemester(
      DashboardComponent.maSV,
      shareService.namHoc,
      shareService.dot
    );
    if (result) {
      //Người gửi lời mời chưa từng tham gia vào nhóm nào
      await this.createGroup();
      await this.joinStudentIntoGroup();
    } else {
      this.groupIdCreated = await (
        await this.thamGiaService.getById(
          DashboardComponent.maSV,
          shareService.namHoc,
          shareService.dot
        )
      ).maNhom;
    }

    if (await this.checkGroupMemberSentInvitation()) {
      create?.classList.remove('active');
      createBox?.classList.remove('active');
      this.isPopupVisible = true;
      this.showGroupMemberAlreadySent = true;
      return;
    } else {
      await this.createLoiMoi();
      create?.classList.remove('active');
      createBox?.classList.remove('active');
      this.showSuccessMessage = true;
      this.isPopupVisible = true;
      this.ngOnInit();
    }
  }

  async createGroup() {
    var nhom = new Nhom();
    nhom.maNhom =
      DashboardComponent.maSV + shareService.namHoc + shareService.dot;
    nhom.tenNhom = (
      await this.sinhVienService.getById(DashboardComponent.maSV)
    ).tenSv;
    this.groupIdCreated = nhom.maNhom;

    this.nhomService.add(nhom);
  }

  async joinStudentIntoGroup() {
    var thamGia = await this.thamGiaService.getById(
      DashboardComponent.maSV,
      shareService.namHoc,
      shareService.dot
    );
    thamGia.maNhom = this.groupIdCreated;
    thamGia.truongNhom = true;

    this.thamGiaService.update(thamGia);
  }

  async checkGroupMemberSentInvitation() {
    let lstLoiMoi =
      await this.loiMoiService.getAllLoiMoiSinhVienByIdDotNamHocNhom(
        this.groupIdCreated,
        this.sinhVien.maSv,
        shareService.namHoc,
        shareService.dot
      );
    if (lstLoiMoi.length > 0) {
      return true;
    }
    return false;
  }

  async getAllThamgiaByDotdk() {
    this.listTg = await this.thamGiaService.GetAllThamgiaDotdkNotme(
      DashboardComponent.maSV,
      shareService.namHoc,
      shareService.dot
    );

    this.listTg = this.listTg.map((tg) => ({
      ...tg,
      ...this.getSinhVienById(tg.maSv),
    }));

    this.root = this.listTg;
  }

  async createLoiMoi() {
    let values: any = this.lmForm.form.value;
    const loiMoi = new LoiMoi();
    const date = new Date();

    loiMoi.dot = shareService.dot;
    loiMoi.loiNhan = values.loiNhan;
    loiMoi.maNhom = this.groupIdCreated;
    loiMoi.maSv = this.sinhVien.maSv;
    loiMoi.namHoc = shareService.namHoc;
    loiMoi.thoiGian = date.toISOString();
    loiMoi.trangThai = false;

    await this.loiMoiService.add(loiMoi);
  }

  async getThamgiaByMaCN(maCn: string) {
    this.listTg = await this.thamGiaService.GetThamgiaByChuyennganhDotdk(
      maCn,
      shareService.namHoc,
      shareService.dot
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      const name = this.searchName.trim().toLowerCase();
      if (name == '') {
        this.listTg = this.root;
      } else {
        this.listTg = await this.thamGiaService.searchThamgiaByName(name);

        this.listTg = this.listTg.map((tg) => ({
          ...tg,
          ...this.getSinhVienById(tg.maSv),
        }));
      }
    }
  }

  getTenCNById(maCn: string): string {
    let tencn: any = '';

    if (this.listCN) {
      tencn = this.listCN.find((t) => t.maCn === maCn)?.tenCn;
      this.listTg = this.listTg.map((tg) => ({
        ...tg,
        ...this.getSinhVienById(tg.maSv),
      }));
    }
    return tencn;
  }

  getSinhVienById(maSV: string) {
    this.sinhVien = this.listSV.find((t) => t.maSv === maSV)!;
    return this.sinhVien;
  }

  checkSentInvitation(maSV: string) {
    return this.lstLoiMoi.find((lm) => lm.maSv == maSV) ? true : false;
  }

  checkSentInvitationForStudent() {
    return this.lstLoiMoi.find((lm) => lm.maSv == this.sinhVien.maSv)
      ? true
      : false;
  }

  async onRemoveInvite() {
    await this.loiMoiService.delete(
      DashboardComponent.maNhom,
      this.sinhVien.maSv,
      shareService.namHoc,
      shareService.dot
    );
    let create = document.querySelector('#create');
    let createBox = document.querySelector('#create_box');
    create?.classList.remove('active');
    createBox?.classList.remove('active');

    this.showSuccessMessage = true;
    this.isPopupVisible = true;
    this.isRemoveInvite = true;

    this.ngOnInit();
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
