import { GiangVienVT } from "./GiangVienVTModel";
import { SinhVienVT } from "./SinhVienVTModel";

export class DeTaiDiemVT {
  public maDT!: string;
  public tenDT!: number;

  public sinhViens!: SinhVienVT[];
  public gvhDs!: GiangVienVT[];
  public gvpBs!: GiangVienVT[];
  public hoiDongs!: GiangVienVT[];

  constructor() {}
}
