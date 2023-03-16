export class ThamGia {
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;
    public maNhom!: string;
    public diemTb!: number;

    constructor() {}

    public init(maSv: string, namHoc: string, dot: number, maNhom: string, diemTb: number) {
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
        this.maNhom = maNhom;
        this.diemTb = diemTb;
    }
}