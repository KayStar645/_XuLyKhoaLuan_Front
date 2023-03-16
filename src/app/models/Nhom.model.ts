export class Nhom {
    public maNhom!: string;
    public tenNhom!: string;
    public truongNhom!: string;


    constructor(){}

    public init(maNhom: string, tenNhom: string, truongNhom: string) {
        this.maNhom = maNhom;
        this.tenNhom = tenNhom;
        this.truongNhom = truongNhom;
    }
}