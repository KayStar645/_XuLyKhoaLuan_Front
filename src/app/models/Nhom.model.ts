export class Nhom {
    public maNhom!: number;
    public tenNhom!: string;
    public soLuong!: number;
    public slmax!: number;
    public truongNhom!: string;


    constructor(maNhom: number, tenNhom: string, soLuong: number, slmax: number, truongNhom: string){
        this.maNhom = maNhom;
        this.tenNhom = tenNhom;
        this.soLuong = soLuong;
        this.slmax = slmax;
        this.truongNhom = truongNhom;
    }
}