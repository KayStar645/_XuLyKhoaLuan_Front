import { format } from 'date-fns';

export class DotDk {
   public namHoc!: string;
   public dot!: number;
   public ngayBd!: string;
   public ngayKt!: string;
   public tgbddk!: string;
   public tgktdk!: string;

   constructor() {}

   public init(
      namHoc: string,
      dot: number,
      ngayBd: string,
      ngayKt: string,
      tgbddk: string,
      tgktdk: string
   ) {
      this.namHoc = namHoc;
      this.dot = dot;
      this.ngayBd = (
         format(new Date(ngayBd.slice(0, 10)), 'yyyy-MM-dd') +
         'T' +
         format(new Date(ngayBd.slice(11, ngayBd.length)), 'HH:mm:ss') +
         '.000Z'
      ).toString();
      this.ngayKt = (
         format(new Date(ngayKt.slice(0, 10)), 'yyyy-MM-dd') +
         'T' +
         format(new Date(ngayKt.slice(11, ngayKt.length)), 'HH:mm:ss') +
         '.000Z'
      ).toString();
      this.tgbddk = (
         format(new Date(tgbddk.slice(0, 10)), 'yyyy-MM-dd') +
         'T' +
         format(new Date(tgbddk.slice(11, tgbddk.length)), 'HH:mm:ss') +
         '.000Z'
      ).toString();
      this.tgktdk = (
         format(new Date(tgktdk.slice(0, 10)), 'yyyy-MM-dd') +
         'T' +
         format(new Date(tgktdk.slice(11, tgktdk.length)), 'HH:mm:ss') +
         '.000Z'
      ).toString();
   }
}
