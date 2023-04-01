export class DotDk {
    public namHoc!: string;
    public dot!: number;
    public thoiGianBD!: string;
    public thoiGianKT!: string;

    constructor(){}

    public init(namHoc: string, dot: number, thoiGianBD: string, thoiGianKT: string) {
        this.namHoc = namHoc;
        this.dot = dot;
        this.thoiGianBD = thoiGianBD;
        this.thoiGianKT = thoiGianKT;
    }
}