export class SinhVien {
  public maSv!: string;
  public tenSv!: string;
  //public ngaySinh!: string;
  public gioiTinh!: string;
  public lop!: string;
  public sdt!: string;
  public email!: string;
  public maCn!: string;

  constructor() {}

  init(
    maSv: string,
    tenSv: string,
    //ngaySinh: string,
    gioiTinh: string,
    lop: string,
    sdt: string,
    email: string,
    maCn: string
  ) {
    this.maSv = maSv;
    this.tenSv = tenSv;
    //ngaySinh && (this.ngaySinh = ngaySinh);
    this.gioiTinh = gioiTinh;
    this.lop = lop;
    this.sdt = sdt;
    this.email = email;
    this.maCn = maCn;
  }

  init2(maSv: string, tenSv: string, lop: string, maCn: string) {
    this.maSv = maSv;
    this.tenSv = tenSv;
    this.lop = lop;
    this.maCn = maCn;

    this.gioiTinh = '';
    this.sdt = '';
    this.email = '';
  }
}
