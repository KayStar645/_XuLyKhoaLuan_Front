export class DangKy {
  public maNhom!: string;
  public maDt!: string;
  public ngayDk!: string;
  public ngayGiao!: string;
  public ngayBd!: string;
  public ngayKt!: string;

  constructor() {}

  init(
    maNhom: string,
    maDt: string,
    ngayGiao: string,
    ngayBd: string,
    ngayKt: string
  ) {
    this.maNhom = maNhom;
    this.maDt = maDt;
    this.ngayDk = '';
    this.ngayGiao = ngayGiao;
    this.ngayBd = ngayBd;
    this.ngayKt = ngayKt;
  }

  init2(
    maNhom: string,
    maDt: string,
    ngayDk: string
  ) {
    this.maNhom = maNhom;
    this.maDt = maDt;
    this.ngayDk = ngayDk;
  }
}