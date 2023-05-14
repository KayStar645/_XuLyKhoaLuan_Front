import { ToastrService } from 'ngx-toastr';
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
import { Form } from 'src/assets/utils';
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
  _maCn!: string;
  _searchName!: string;

  listTg: any[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();
  groupIdCreated = '';
  lstLoiMoi: LoiMoi[] = [];

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
    private loiMoiService: loiMoiService,
    private toastService: ToastrService
  ) {}

  async ngOnInit() {
    this.listSV = await this.sinhVienService.getAll();
    this.getAllThamgiaByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();

    this.lstLoiMoi =
      await this.loiMoiService.getAllLoiMoiSinhVienByDotNamHocNhom(
        DashboardComponent.maNhom,
        shareService.namHoc,
        shareService.dot
      );

    this.websocketService.startConnection();
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.sinhVienService.getAll().then((data) => (this.listSV = data));
        this.getAllThamgiaByDotdk();
      }
    });
  }

  onShowInvite(event: MouseEvent) {
    let element = event.target as HTMLElement;
    let create = document.querySelector('#create');
    let createBox = document.querySelector('#create_box');

    create?.classList.add('active');
    createBox?.classList.add('active');

    this.getSinhVienById(element.dataset.index!);
  }

  onHideInvite(event: any) {
    event.target.classList.remove('active');
    document.querySelector('#create_box')?.classList.remove('active');
  }

  async onSendInvite() {
    let create = document.querySelector('#create');
    let createBox = document.querySelector('#create_box');

    //Xuất ra lỗi khi nhóm đã đăng ký đề tài
    if (DashboardComponent.isSignUpDeTai) {
      this.toastService.error(
        'Nhóm bạn đã đăng ký đề tài nên không thể gửi lời mời nhóm',
        'Thông báo !'
      );
      create?.classList.remove('active');
      createBox?.classList.remove('active');
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
      this.groupIdCreated = (
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
      this.toastService.info(
        'Nhóm bạn đã gửi lời mời cho sinh viên này',
        'Thông báo !'
      );
      return;
    } else {
      await this.createLoiMoi();
      create?.classList.remove('active');
      createBox?.classList.remove('active');
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
    this.listTg = await this.thamGiaService.GetAllThamgiaInfDotdkNotme(
      DashboardComponent.maSV,
      shareService.namHoc,
      shareService.dot
    );
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

    try {
      await this.loiMoiService.add(loiMoi);
      this.toastService.success('Gửi lời mời thành công', 'Thông báo !');
    } catch (error) {
      this.toastService.error('Gửi lời mời thất bại', 'Thông báo !');
    }
  }

  async getThamgiaByMaCN(maCn: string) {
    this._maCn = maCn;
    this.listTg = await this.thamGiaService.search(
      this._searchName,
      this._maCn,
      shareService.namHoc,
      shareService.dot
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      const name = this.searchName.trim().toLowerCase();
      this._searchName = name;

      this.listTg = await this.thamGiaService.search(
        this._searchName,
        this._maCn,
        shareService.namHoc,
        shareService.dot
      );
    }
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

    this.toastService.success('Hủy lời mời thành công', 'Thông báo !');

    this.ngOnInit();
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
