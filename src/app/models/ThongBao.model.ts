export class ThongBao {
  public maTb!: number;
  public tenTb!: string;
  public moTa!: string;
  public noiDung!: string;
  public hinhAnh!: string;
  public fileTb!: string;
  public maKhoa!: string;
  public ngayTb!: string;

  constructor() {}

  init(
    maTb: number,
    tenTb: string,
    moTa: string,
    noiDung: string,
    hinhAnh: string,
    fileTb: string,
    maKhoa: string,
    ngayTb: string
  ) {
    this.maTb = maTb;
    this.tenTb = tenTb;
    this.moTa = moTa;
    this.noiDung = noiDung;
    this.hinhAnh = hinhAnh;
    this.fileTb = fileTb;
    this.maKhoa = maKhoa;
    this.ngayTb = ngayTb;
  }
}
