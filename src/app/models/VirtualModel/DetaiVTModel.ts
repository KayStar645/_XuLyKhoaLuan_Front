import { ChuyenNganh } from "../ChuyenNganh.model";
import { GiangVienVT } from "./GiangVienVTModel";

export class DetaiVT {
   public maBm!: string;
   public maDT!: string;
   public tenDT!: string;
   public tomTat!: string;
   public slMin!: number;
   public slMax!: number;
   public trangThai!: string;
   public namHoc!: string;
   public dot!: number;
   public duyetDT!: number;
   public ngayDuyet!: string;

   public cnPhuHop: ChuyenNganh[] = [];
   public gvrd: GiangVienVT[] = [];
   public gvhd: GiangVienVT[] = [];
   public gvpb: GiangVienVT[] = [];

   constructor() {}
}
