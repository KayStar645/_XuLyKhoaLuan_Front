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
  listTg: ThamGia[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();
  groupIdCreated = '';
  isSentInvitationToThisStudent = false;
  lstLoiMoi: LoiMoi[] = [];

  isNotHaveStudent = false;
  isSignUpDeTai = false;
  isPopupVisible = false;
  isSentToNotJoinStudent = false;
  showSuccessMessage = false;
  showSentToSelfError = false;
  showGroupMemberAlreadySent = false;

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
    private elementRef: ElementRef,
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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedTG = [];
        this.returnIsSelectedTG.emit(false);
        let activeLine = this.elementRef.nativeElement.querySelectorAll(
          '.br-line.br-line-click'
        );

        if (activeLine) {
          activeLine.forEach((line: any) => {
            line.classList.remove('br-line-click');
          });
        }
      }
    });

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
    console.log(this.lstLoiMoi);
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const namHoc_Dot: string = parent.querySelector('.namhoc_dot').innerText;
    const namHoc = namHoc_Dot.substring(0, 9);
    const dot = parseInt(namHoc_Dot[namHoc_Dot.length - 1]);

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineTG = await this.thamGiaService.getById(
        firstChild.innerText,
        namHoc,
        dot
      );
      parent.classList.add('br-line-dblclick');
    } else {
      this.lineTG = new ThamGia();
      parent.classList.remove('br-line-dblclick');
    }
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
    this.showSentToSelfError = false;
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
    console.log(this.listTg);
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
      }
    }
  }

  getTenCNById(maCn: string): string {
    let tencn: any = '';

    if (this.listCN) {
      tencn = this.listCN.find((t) => t.maCn === maCn)?.tenCn;
    }
    return tencn;
  }

  getSinhVienById(maSV: string) {
    this.sinhVien = this.listSV.find((t) => t.maSv === maSV) ?? this.sinhVien;
  }

  checkSentInvitation(maSV: string) {
    //return this.lstLoiMoi.find((lm) => lm.maSv == maSV) ? true : false;
    return true;
  }

  async onRemoveLoiMoi(maSV: string) {
    await this.loiMoiService.delete(
      DashboardComponent.maNhom,
      maSV,
      shareService.namHoc,
      shareService.dot
    );
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
