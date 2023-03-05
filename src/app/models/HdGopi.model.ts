export class HdGopi {
    public id!: number;
    public thoiGian!: string;
    public noiDung!: string;
    public maCv!: string;
    public maGv!: string;
    public maDt!: string;

    constructor(id: number, thoiGian: string, noiDung: string, maCv: string, maGv: string, maDt: string){
        this.id = id;
        this.thoiGian = thoiGian;
        this.noiDung = noiDung;
        this.maCv = maCv;
        this.maGv = maGv;
        this.maDt = maDt;
    }
}