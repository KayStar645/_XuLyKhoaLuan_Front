export class DangKy {
    public maDT!: string;
    public tenDT!: string;
    public tomTat!: string;
    public slMin!: number;
    public slMax!: number;
    public trangThai!: boolean;

    constructor(maDT: string, tenDT: string, tomTat: string, slMin: number, 
        slMax: number, trangThai: boolean){
        this.maDT = maDT;
        this.tenDT = tenDT;
        this.tomTat = tomTat;
        this.slMin = slMin;
        this.slMax = slMax;
        this.trangThai = trangThai;
    }
}