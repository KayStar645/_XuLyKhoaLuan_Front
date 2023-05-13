import { GiangVienVT } from "./GiangVienVTModel";

export class HoiDongVT {
  public maHD!: string;
  public tenHD!: string;
  public ngayLap!: string;
  public thoiGianBD!: string;
  public thoiGianKT!: string;
  public diaDiem!: string;

  public chuTich!: GiangVienVT;
  public thuKy!: GiangVienVT;
  public uyViens!: GiangVienVT[];

  constructor() {}

}
