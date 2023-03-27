export class NhiemVu {
  public maNv!: number;
  public tenNv!: string;
  public soLuongDt!: number;
  public thoiGianBd!: string;
  public thoiGianKt!: string;
  public hinhAnh!: string;
  public fileNv!: string;
  public maBm!: string;
  public maGv!: string;

  constructor() {}

  init(
    maNv: number,
    tenNv: string,
    soLuongDt: number,
    thoiGianBd: string,
    thoiGianKt: string,
    fileNv: string,
    maBm: string,
    maGv: string
  ) {
    this.maNv = maNv;
    this.tenNv = tenNv;
    this.hinhAnh = 'test.png';
    this.soLuongDt = soLuongDt;
    this.thoiGianBd = thoiGianBd;
    this.thoiGianKt = thoiGianKt;
    this.fileNv = fileNv ? fileNv : 'error.pdf';
    this.maBm = maBm;
    this.maGv = maGv;
  }
}
