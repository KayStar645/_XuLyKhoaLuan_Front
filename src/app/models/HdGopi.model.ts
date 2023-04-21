export class HdGopi {
  public id!: number;
  public thoiGian!: string;
  public noiDung!: string;
  public maCv!: string;
  public maGv!: string;
  public maDt!: string;

  constructor() {}

  public init(noiDung: string, thoiGian: string, maCv: string, maGv: string, maDt: string) {
    this.noiDung = noiDung;
    this.thoiGian = thoiGian;
    this.maCv = maCv;
    this.maGv = maGv;
    this.maDt = maDt;
  }
}