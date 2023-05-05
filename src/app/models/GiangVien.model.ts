import { format } from "date-fns";

export class GiangVien {
  public maGv!: string;
  public tenGv!: string;
  public ngaySinh!: string;
  public gioiTinh!: string;
  public email!: string;
  public sdt!: string;
  public hocHam!: string;
  public hocVi!: string;
  public ngayNhanViec!: string;
  public ngayNghi!: string;
  public maBm!: string;
  cNhiemVu: number[] = [0, 0, 0, 0, 0];

  constructor() {}

  init(
    maGv: string,
    tenGv: string,
    ngaySinh: string,
    gioiTinh: string,
    email: string,
    sdt: string,
    hocHam: string,
    hocVi: string,
    ngayNhanViec: string,
    ngayNghi: string,
    maBm: string
  ) {
    this.maGv = maGv;
    this.tenGv = tenGv;
    this.ngaySinh = ngaySinh == '' ? this.ngaySinh : ngaySinh;
    this.gioiTinh = gioiTinh;
    this.email = email;
    this.sdt = sdt;
    this.hocHam = hocHam;
    this.hocVi = hocVi;
    this.ngayNhanViec = ngayNhanViec == '' ? this.ngayNhanViec : ngayNhanViec;
    this.ngayNghi = ngayNghi == '' ? this.ngayNghi : ngayNghi;
    this.maBm = maBm;
  }

  initT(
    maGv: string,
    tenGv: string,
    gioiTinh: string,
    email: string,
    sdt: string,
    hocVi: string,
    maBm: string
  ) {
    this.maGv = maGv;
    this.tenGv = tenGv;
    this.gioiTinh = gioiTinh;
    this.email = email;
    this.sdt = sdt;
    this.hocVi = hocVi;
    this.ngayNhanViec = format(new Date(), "yyyy:MM:dd");
    this.maBm = maBm;
  }
}
