export class LoiMoi {
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;
    public maNhom!: number;
    public loiNhan!: string;
    public thoiGian!: string;
    public trangThai!: boolean;

    constructor(maSv: string, namHoc: string, dot: number, maNhom: number, loiNhan: string
        , thoiGian: string, trangThai: boolean){
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
        this.maNhom = maNhom;
        this.loiNhan = loiNhan;
        this.thoiGian = thoiGian;
        this.trangThai = trangThai;
    }
}