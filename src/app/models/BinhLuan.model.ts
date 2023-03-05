export class BinhLuan {
    public id!: number;
    public thoiGian!: string;
    public noiDung!: string;
    public maCv!: string;
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;

    constructor(id: number, thoiGian: string, noiDung: string, maCv: string, maSv: string, 
        namHoc: string, dot: number) {
        this.id = id;
        this.thoiGian = thoiGian;
        this.noiDung = noiDung;
        this.maCv = maCv;
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
    }
}