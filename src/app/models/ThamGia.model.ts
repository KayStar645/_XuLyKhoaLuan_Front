export class ThamGia {
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;
    public maNhom!: number;
    public diemTb!: number;

    constructor(maSv: string, namHoc: string, dot: number, maNhom: number, diemTb: number) {
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
        this.maNhom = maNhom;
        this.diemTb = diemTb;
    }
}