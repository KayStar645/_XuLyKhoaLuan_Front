export class KeHoach {
  public maKh!: number;
  public tenKh!: string;
  public soLuongDt!: number;
  public thoiGianBd!: string;
  public thoiGianKt!: string;
  public hinhAnh!: string;
  public fileKh!: string;
  public maKhoa!: string;
  public maBm!: string;

  constructor() {}

  init(
    maKh: number,
    tenKh: string,
    soLuongDt: number,
    thoiGianBd: string,
    thoiGianKt: string,
    fileKh: string,
    maKhoa: string,
    maBm: string
  ) {
    this.maKh = maKh;
    this.tenKh = tenKh;
    this.hinhAnh = 'test.png';
    this.soLuongDt = soLuongDt;
    this.thoiGianBd = thoiGianBd;
    this.thoiGianKt = thoiGianKt;
    this.fileKh = fileKh ? fileKh : 'error.pdf';
    this.maBm = maBm;
    this.maKhoa = maKhoa;
  }
}
