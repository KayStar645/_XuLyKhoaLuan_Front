import { Component, SimpleChanges } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DangKy } from 'src/app/models/DangKy.model';
import { DeTai } from 'src/app/models/DeTai.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { RaDe } from 'src/app/models/RaDe.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { deTaiService } from 'src/app/services/deTai.service';
import { deTai_chuyenNganhService } from 'src/app/services/deTai_chuyenNganh.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { raDeService } from 'src/app/services/raDe.service';
import { DashboardComponent } from '../dashboard.component';
import { dangKyService } from 'src/app/services/dangKy.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { shareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { HuongDan } from 'src/app/models/HuongDan.model';
import { huongDanService } from 'src/app/services/huongDan.service';
import { HomeComponent } from 'src/app/home/home.component';

@Component({
  selector: 'app-dashboard-detai',
  templateUrl: './dashboard-detai.component.html',
  styleUrls: ['./dashboard-detai.component.scss'],
})
export class DashboardDetaiComponent {
  listCn: ChuyenNganh[] = [];
  listDT: DeTai[] = [];
  listRade: RaDe[] = [];
  listGiangvien: GiangVien[] = [];
  listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
  listChuyennganh: ChuyenNganh[] = [];
  tenDT = new Subject<string>();
  root: DeTai[] = [];
  searchName = '';
  selectedDt: any;
  isPopupVisible = false;
  isSuccessPopup = false;
  isNotGroupLeader = false;
  isQuantityNotRequired = false;
  isAlreadySignUpDeTai = false;
  isNotHaveDeTai = false;

  constructor(
    private deTaiService: deTaiService,
    private raDeService: raDeService,
    private giangVienService: giangVienService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private chuyenNganhService: chuyenNganhService,
    private dangKyService: dangKyService,
    private thamGiaService: thamGiaService,
    private sinhVienService: sinhVienService,
    private huongDanService: huongDanService,
    private websocketService: WebsocketService,
    private shareService: shareService,
    private router: Router
  ) {}

  public async ngOnInit() {
    //Nếu không có trong tham gia không được mời quay trở lại trang chủ
    if (
      (await this.thamGiaService.isJoinedAGroup(
        DashboardComponent.maSV,
        shareService.namHoc,
        shareService.dot
      )) == false
    ) {
      this.router.navigate(['dashboard']);
    }

    //Nếu chưa có nhóm quay trở lại trang chủ
    if (
      (await this.thamGiaService.isNotJoinedAGroupThisSemester(
        DashboardComponent.maSV,
        shareService.namHoc,
        shareService.dot
      )) == true
    ) {
      this.router.navigate(['dashboard']);
    }

    if (
      (await this.deTaiService.isHaveDeTaiInNamHocDotActive(
        shareService.namHoc,
        shareService.dot
      )) == true
    ) {
      this.isPopupVisible = true;
      this.isNotHaveDeTai = true;
      // return; // Đây là cái gì
    }

    // console.log(DashboardComponent.maNhom);
    this.listDT = await this.dangKyService.GetAllDetaiDangky(
      shareService.namHoc,
      shareService.dot,
      DashboardComponent.maNhom
    );
    this.listRade = await this.raDeService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listCn = await this.chuyenNganhService.getAll();
    if (this.websocketService) {
      this.websocketService.receiveFromDeTai(() => this.getAllDeTai());
    }

    this.tenDT.pipe(debounceTime(800)).subscribe((tenDT) => {
      if (tenDT) {
        this.listDT = this.root.filter((item) =>
          item.tenDT.toLowerCase().includes(tenDT)
        );
      } else {
        this.listDT = this.root;
      }
    });
  }

  getTenGvRadeByMaDT(maDT: string) {
    let result = [];
    let rades = this.listRade.filter((item) => item.maDt == maDT);
    for (let item of rades) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getTenChuyennganhByMaDT(maDT: string) {
    let result = [];
    let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);
    for (let item of dtcns) {
      result.push(this.listCn.find((c) => c.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  async onGetDetaiByMaCn(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.listDT = (await this.deTaiService.getAll()).filter(
        (dt) =>
          dt.trangThai === true &&
          dt.namHoc == shareService.namHoc &&
          dt.dot == shareService.dot
      );
    } else {
      this.listDT = (await this.deTaiService.getByChuyenNganh(maCn)).filter(
        (dt) =>
          dt.trangThai === true &&
          dt.namHoc == shareService.namHoc &&
          dt.dot == shareService.dot
      );
    }
  }

  async getAllDeTai() {
    this.listDT = (await this.deTaiService.getAll()).filter(
      (dt) =>
        dt.trangThai === true &&
        dt.namHoc == shareService.namHoc &&
        dt.dot == shareService.dot
    );
    this.root = this.listDT;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listDT = this.root.filter((item) =>
      item.tenDT.toLowerCase().includes(searchName)
    );
  }

  onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this.tenDT.next(searchName);
  }

  openModal(dt: any) {
    this.selectedDt = dt;
  }

  closeModal() {
    this.selectedDt = null;
  }

  async onSignUpDeTai(deTai: DeTai) {
    this.isPopupVisible = false;
    this.isSuccessPopup = false;
    this.isNotGroupLeader = false;
    this.isQuantityNotRequired = false;
    this.isAlreadySignUpDeTai = false;
    let lstStudent: SinhVien[] = [];
    const lstThamGia = (await this.thamGiaService.getAll()).filter(
      (tg) => tg.maNhom == DashboardComponent.maNhom
    );
    lstThamGia.forEach(async (thamGia) =>
      lstStudent.push(await this.sinhVienService.getById(thamGia.maSv))
    );
    let leaderId = lstThamGia.filter((tgia) => tgia.truongNhom === true)[0]
      .maSv;
    let dangKyDeTai: DangKy[] = (await this.dangKyService.getAll()).filter(
      (dk) => dk.maNhom === DashboardComponent.maNhom
    );

    //Đã đăng ký đề tài không thể đăng ký nữa
    if (dangKyDeTai.length > 0) {
      this.isPopupVisible = true;
      this.isAlreadySignUpDeTai = true;
      return;
    }

    //Không là nhóm trưởng không được đăng ký
    if (DashboardComponent.maSV !== leaderId) {
      this.isPopupVisible = true;
      this.isNotGroupLeader = true;
      return;
    }

    //Nhóm không thỏa thành viên
    let groupMemberQuantity = lstThamGia.length;
    if (
      groupMemberQuantity < deTai.slMin ||
      groupMemberQuantity > deTai.slMax
    ) {
      this.isPopupVisible = true;
      this.isQuantityNotRequired = true;
      return;
    }

    const dangKy = new DangKy();
    const date = new Date();
    dangKy.maDt = deTai.maDT;
    dangKy.maNhom = DashboardComponent.maNhom;
    dangKy.ngayDk = date.toISOString();

    await this.dangKyService
      .add(dangKy)
      .then(() => this.showSuccessPopup(deTai))
      .catch((error) => (this.isPopupVisible = true));
  }

  async showSuccessPopup(deTai: DeTai) {
    this.isPopupVisible = true;
    this.isSuccessPopup = true;
    deTai.trangThai = true;
    await this.deTaiService.update(deTai);
    this.listDT = (await this.deTaiService.getAll()).filter(
      (dt) =>
        dt.trangThai === true &&
        dt.namHoc == shareService.namHoc &&
        dt.dot == shareService.dot
    );
    await this.insertHuongDan(deTai.maDT);
    this.shareService.setIsFirstClickHome(true);
    this.websocketService.receiveFromDeTai(() => this.getAllDeTai());
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

  async insertHuongDan(MaDT: string) {
    let lstMaGvhd: string[] = [];
    let lstGvhd = (await this.raDeService.getAll()).filter(
      (rd) => rd.maDt === MaDT
    );
    lstGvhd.forEach((gv) => lstMaGvhd.push(gv.maGv));
    for (let i = 0; i < lstMaGvhd.length; i++) {
      const a = new HuongDan();
      a.duaRaHd = false;
      a.maDt = MaDT;
      a.maGv = lstMaGvhd[i];

      await this.huongDanService.add(a);
    }
  }
}
