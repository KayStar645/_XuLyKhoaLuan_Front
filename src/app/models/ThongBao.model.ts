export class ThongBao {
  public maTb!: number;
  public tenTb!: string;
  public noiDung!: string;
  public hinhAnh!: string;
  public fileTb!: string;
  public maKhoa!: string;
  public ngayTb!: string;

  constructor() {}

  init(
    tenTb: string,
    noiDung: string,
    hinhAnh: string,
    fileTb: string,
    maKhoa: string,
    ngayTb: string
  ) {
    this.tenTb = tenTb;
    this.noiDung = noiDung;
    this.hinhAnh = hinhAnh;
    this.fileTb = fileTb;
    this.maKhoa = maKhoa;
    this.ngayTb = ngayTb;
  }
}
