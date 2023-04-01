export class DuyetDt {
  public maGv!: string;
  public maDt!: string;
  public lanDuyet!: number;
  public ngayDuyet!: string;
  public nhanXet!: string;

  constructor() {}

  init(
    maGv: string,
    maDt: string,
    lanDuyet: number,
    ngayDuyet: string,
    nhanXet: string
  ) {
    this.maGv = maGv;
    this.maDt = maDt;
    this.lanDuyet = lanDuyet;
    this.ngayDuyet = ngayDuyet;
    this.nhanXet = nhanXet;
  }
}
