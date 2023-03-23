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
    hinhAnh: string,
    fileNv: string,
    maBm: string,
    maGv: string
  ) {
    this.maNv = maNv;
    this.tenNv = tenNv;
    this.soLuongDt = soLuongDt;
    this.thoiGianBd = thoiGianBd;
    this.thoiGianKt = thoiGianKt;
    this.hinhAnh = hinhAnh;
    this.fileNv = fileNv;
    this.maBm = maBm;
    this.maGv = maGv;
  }
}
