export class PbCham {
    public maGv!: string;
    public maDt!: string;
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;
    public diem!: number;

    constructor(maGv: string, maDt: string, maSv: string, namHoc: string, dot: number, diem: number){
        this.maGv = maGv;
        this.maDt = maDt;
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
        this.diem = diem;
    }
}