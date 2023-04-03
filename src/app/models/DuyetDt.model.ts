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
    ngayDuyet: string,
    nhanXet: string
  ) {
    this.maGv = maGv;
    this.maDt = maDt;
    this.ngayDuyet = ngayDuyet;
    this.nhanXet = nhanXet;
  }
}
