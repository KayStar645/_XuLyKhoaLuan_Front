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
      this.ngayBd =
         format(new Date(ngayBd), 'yyyy-MM-dd') +
         'T' +
         format(new Date(ngayBd), 'HH:mm:ss') +
         '.000Z';
      this.ngayKt =
         format(new Date(ngayKt), 'yyyy-MM-dd') +
         'T' +
         format(new Date(ngayKt), 'HH:mm:ss') +
         '.000Z';
      this.tgbddk =
         format(new Date(tgbddk), 'yyyy-MM-dd') +
         'T' +
         format(new Date(tgbddk), 'HH:mm:ss') +
         '.000Z';
      this.tgktdk =
         format(new Date(tgktdk), 'yyyy-MM-dd') +
         'T' +
         format(new Date(tgktdk), 'HH:mm:ss') +
         '.000Z';
   }
}
