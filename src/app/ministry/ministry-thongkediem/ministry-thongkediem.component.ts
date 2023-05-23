import { dotDkService } from './../../services/dotDk.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { Component, ViewChild } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { DotDk } from 'src/app/models/DotDk.model';
import { MinistryDanhsachdiemComponent } from './ministry-thongkediem/ministry-danhsachdiem.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';

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

  onExportList() {
    const data: any = [
      [
        'Mã SV',
        'Họ và tên',
        'Lớp',
        'Chuyên ngành',
        'Điểm GVHD',
        'Điểm GVPB',
        'Điểm HĐ',
        'Điểm TB',
      ],
    ];

    this.DSDComponent.temps.forEach((sv) => {
      data.push([
        sv.maSv,
        sv.tenSv,
        sv.lop,
        sv.chuyenNganh,
        sv.diemHd,
        sv.diemPb,
        sv.diemHdpb == -1 ? '' : sv.diemHdpb,
        sv.diemTb,
      ]);
    });

    // Tạo workbook và worksheet mới
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách');

    // Chuyển đổi workbook thành file Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    const fileName = 'danh_sach.xlsx';

    // Tạo đường dẫn tải xuống và tạo liên kết tải xuống
    const downloadLink = document.createElement('a');
    const url = URL.createObjectURL(dataBlob);
    downloadLink.href = url;
    downloadLink.setAttribute('download', fileName);

    // Thêm liên kết vào DOM và kích hoạt việc tải xuống
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Xóa liên kết khỏi DOM và giải phóng đường dẫn tải xuống
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  onChangeCn(event: any) {
    const maCn = event.target.value;
    this.DSDComponent.getSinhVienByMaCN(maCn);
  }

  onChangeDotdk(event: any) {
    const dotdk = event.target.value;
    this.DSDComponent.getSinhVienByDotdk(dotdk);
  }
}
