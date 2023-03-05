export class CongViec {
    public maCv!: string;
    public tenCv!: string;
    public yeuCau!: string;
    public moTa!: string;
    public hanChot!: string;
    public mucDoHoanThanh!: number;
    public maGv!: string;
    public maDt!: string;
    public maNhom!: number;

    constructor(maCv: string, tenCv: string, yeuCau: string, moTa: string, hanChot: string,
        mucDoHoanThanh: number, maGv: string, maDt: string, maNhom: number){
        this.maCv = maCv;
        this.tenCv = tenCv;
        this.yeuCau = yeuCau;
        this.moTa = moTa;
        this.hanChot = hanChot;
        this.mucDoHoanThanh = mucDoHoanThanh;
        this.maGv = maGv;
        this.maDt = maDt;
        this.maNhom = maNhom;
    }
}