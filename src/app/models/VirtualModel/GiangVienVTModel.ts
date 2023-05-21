export class GiangVienVT {
  public maGv!: string;
  public tenGv!: string;
  /*
    1: Hướng dẫn
    2: Phản biện
    3: Hội đồng
  */
  public vaiTro!: number;
  public maChucVu!: string;
  public chucVu!: string;
  public duaRaHoiDong!: number;

  constructor() {}

  createNull() {
    this.maGv = '';
    this.tenGv = '';
    this.vaiTro = 0;
    this.maChucVu = "";
    this.chucVu = '';
    this.duaRaHoiDong = 0;
  }
}
