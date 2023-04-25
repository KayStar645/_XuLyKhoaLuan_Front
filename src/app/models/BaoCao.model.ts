export class BaoCao {
    public maCv!: string;
    public maSv!: string;
    public namHoc!: string;
    public dot!: number;
    public lanNop!: number;
    public thoiGianNop!: string;
    public fileBc!: string;

    constructor() {}

    init(maCv: string, maSv: string, namHoc: string, dot: number, thoiGianNop: string, fileBc: string) {
        this.maCv = maCv;
        this.maSv = maSv;
        this.namHoc = namHoc;
        this.dot = dot;
        this.thoiGianNop = thoiGianNop;
        this.fileBc = fileBc;
    }
}