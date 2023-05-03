export class DeTai {
  public maDT!: string;
  public tenDT!: string;
  public tomTat!: string;
  public slMin!: number;
  public slMax!: number;
  public trangThai!: boolean;
  public namHoc!: string;
  public dot!: number;
  public isDangKy!: boolean;

  constructor() {}

  init(
    maDT: string,
    tenDT: string,
    tomTat: string,
    slMin: number,
    slMax: number,
    namHoc: string,
    dot: number
  ) {
    this.maDT = maDT;
    this.tenDT = tenDT;
    this.tomTat = tomTat;
    this.slMin = slMin;
    this.slMax = slMax;
    this.trangThai = false;
    this.namHoc = namHoc;
    this.dot = dot;
  }

  // initF(
  //   maDT: string,
  //   tenDT: string,
  //   tomTat: string,
  //   slMin: number,
  //   slMax: number,
  //   trangThai: boolean,
  //   namHoc: string,
  //   dot: number
  // ) {
  //   this.maDT = maDT;
  //   this.tenDT = tenDT;
  //   this.tomTat = tomTat;
  //   this.slMin = slMin;
  //   this.slMax = slMax;
  //   this.trangThai = trangThai;
  //   this.namHoc = namHoc;
  //   this.dot = dot;
  // }
}
