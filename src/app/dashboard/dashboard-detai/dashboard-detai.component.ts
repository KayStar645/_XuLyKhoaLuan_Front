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

@Component({
  selector: 'app-dashboard-detai',
  templateUrl: './dashboard-detai.component.html',
  styleUrls: ['./dashboard-detai.component.scss']
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

  constructor(
    private deTaiService:deTaiService,
    private raDeService:raDeService,
    private giangVienService: giangVienService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
    private chuyenNganhService: chuyenNganhService,
    private dangKyService: dangKyService,
    private thamGiaService: thamGiaService,
    private sinhVienService: sinhVienService,
    private websocketService: WebsocketService,
    private shareService: shareService,
  ) {}

  public async ngOnInit() {
    this.listDT = (await this.deTaiService.getAll()).filter(dt => dt.trangThai === true);
    this.listRade = await this.raDeService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listCn = await this.chuyenNganhService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();
    this.websocketService.receiveFromDeTai(() => this.getAllDeTai());

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
      result.push(this.listChuyennganh.find((c) => c.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  async onGetDetaiByMaCn(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.listDT = (await this.deTaiService.getAll()).filter(dt => dt.trangThai === true);
    } else {
      this.listDT = (await this.deTaiService.getByChuyenNganh(maCn)).filter(dt => dt.trangThai === true);
    }
    console.log(maCn);
  }

  async getAllDeTai(){
    this.listDT = (await this.deTaiService.getAll()).filter(dt => dt.trangThai === true);
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

  async sortGiangVien(event: any) {
    const sort = event.target.value;

    if (sort == 'asc-id') {
      this.listDT.sort((a, b) => a.maDT.localeCompare(b.maDT));
    } else if (sort == 'desc-id') {
      this.listDT.sort((a, b) => b.maDT.localeCompare(a.maDT));
    } else if (sort == 'asc-name') {
      this.listDT.sort((a, b) => a.tenDT.localeCompare(b.tenDT));
    } else if (sort == 'desc-name') {
      this.listDT.sort((a, b) => b.tenDT.localeCompare(a.tenDT));
    } else {
      this.getAllDeTai();
    }
  }

  onSearchName(event: any) {
    const searchName = event.target.value.trim().toLowerCase();
    this.tenDT.next(searchName);
  }

  openModal(dt: any){
    this.selectedDt = dt;
  }

  closeModal(){
    this.selectedDt = null;
  }

  async onSignUpDeTai(deTai: DeTai){
    this.isPopupVisible = false;
    this.isSuccessPopup = false;
    this.isNotGroupLeader = false;
    this.isQuantityNotRequired = false;
    this.isAlreadySignUpDeTai = false;
    let lstStudent: SinhVien[] = [];
    const lstThamGia = (await this.thamGiaService.getAll()).filter(tg => tg.maNhom == DashboardComponent.maNhom);
    lstThamGia.forEach(async thamGia => lstStudent.push(await this.sinhVienService.getById(thamGia.maSv)));
    let leaderId = lstThamGia.filter(tgia => tgia.truongNhom === true)[0].maSv;
    let dangKyDeTai: DangKy[] = (await this.dangKyService.getAll()).filter(dk => dk.maNhom === DashboardComponent.maNhom);
    
    //Đã đăng ký đề tài không thể đăng ký nữa
    if(dangKyDeTai.length > 0){
      this.isPopupVisible = true;
      this.isAlreadySignUpDeTai = true;
      return;
    }
    
    //Không là nhóm trưởng không được đăng ký
    if(DashboardComponent.maSV !== leaderId){
      this.isPopupVisible = true;
      this.isNotGroupLeader = true;
      return;
    }

    //Nhóm không thỏa thành viên
    let groupMemberQuantity = lstThamGia.length;
    if(groupMemberQuantity < deTai.slMin || groupMemberQuantity > deTai.slMax){
      this.isPopupVisible = true;
      this.isQuantityNotRequired = true;
      return;
    }

    const dangKy = new DangKy();
    const date = new Date();
    dangKy.maDt = deTai.maDT;
    dangKy.maNhom = DashboardComponent.maNhom;
    dangKy.ngayDk = date.toISOString();

    this.dangKyService.add(dangKy)
      .then(() => this.showSuccessPopup(deTai))
      .catch((error) => this.isPopupVisible = true);
  }

  async showSuccessPopup(deTai: DeTai){
    this.isPopupVisible = true;
    this.isSuccessPopup = true;
    deTai.trangThai = false;
    await this.deTaiService.update(deTai);
    this.listDT = (await this.deTaiService.getAll()).filter(dt => dt.trangThai === true);
    this.shareService.setIsFirstClickHome(true);
    this.websocketService.receiveFromDeTai(() => this.getAllDeTai());
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}