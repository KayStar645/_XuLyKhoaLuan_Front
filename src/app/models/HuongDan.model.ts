export class HuongDan {
  public maGv!: string;
  public maDt!: string;
  public duaRaHd!: boolean;

  constructor() {}

  init(maGv: string, maDt: string, duaRaHd: boolean) {
    this.maGv = maGv;
    this.maDt = maDt;
    this.duaRaHd = duaRaHd;
  }
}
