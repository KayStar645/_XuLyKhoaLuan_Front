export class GiangVienVT {
  public maGV!: string;
  public tenGV!: string;
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
    this.maGV = '';
    this.tenGV = '';
    this.vaiTro = 0;
    this.maChucVu = "";
    this.chucVu = '';
    this.duaRaHoiDong = 0;
  }
}
