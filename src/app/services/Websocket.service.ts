import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root',
})
export class WebsocketService {
   private hubConnection!: signalR.HubConnection;

   constructor() {}

   public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
         .withUrl(`${environment.api}/websocket`)
         .build();

      this.hubConnection
         .start()
         .then(() => console.log('Connection started'))
         .catch((err) => console.log('Error while starting connection: ' + err));
   };

   public closeConnection = () => {
      this.hubConnection
         .stop()
         .then(() => console.log('Connection closed'))
         .catch((err) => console.log('Error while closing connection: ' + err));
   };

   // 1. Báo cáo
   public sendForBaoCao = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForBaoCao', dataChange).catch((err) => console.error(err));
   };

   public receiveFromBaoCao = (callback: any) => {
      this.hubConnection.on('ReceiveFromBaoCao', callback);
   };

   // 2. Bình luận
   public sendForBinhLuan = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForBinhLuan', dataChange).catch((err) => console.error(err));
   };

   public receiveFromBinhLuan = (callback: any) => {
      this.hubConnection.on('ReceiveFromBinhLuan', callback);
   };

   // 3. Bộ môn
   public sendForBoMon = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForBoMon', dataChange).catch((err) => console.error(err));
   };

   public receiveFromBoMon = (callback: any) => {
      this.hubConnection.on('ReceiveFromBoMon', callback);
   };

   // 4. Chuyên ngành
   public sendForChuyenNganh = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForChuyenNganh', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromChuyenNganh = (callback: any) => {
      this.hubConnection.on('ReceiveFromChuyenNganh', callback);
   };

   // 5. Công việc
   public sendForCongViec = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForCongViec', dataChange).catch((err) => console.error(err));
   };

   public receiveFromCongViec = (callback: any) => {
      this.hubConnection.on('ReceiveFromCongViec', callback);
   };

   // 6. Đăng ký
   public sendForDangKy = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForDangKy', dataChange).catch((err) => console.error(err));
   };

   public receiveFromDangKy = (callback: any) => {
      this.hubConnection.on('ReceiveFromDangKy', callback);
   };

   // 7. Đề tài - Chuyên ngành
   public sendForDeTai_ChuyenNganh = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForDeTai_ChuyenNganh', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromDeTai_ChuyenNganh = (callback: any) => {
      this.hubConnection.on('ReceiveFromDeTai_ChuyenNganh', callback);
   };

   // 8. Đề tài
   public sendForDeTai = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForDeTai', dataChange).catch((err) => console.error(err));
   };

   public receiveFromDeTai = (callback: any) => {
      this.hubConnection.on('ReceiveFromDeTai', callback);
   };

   // 9. Đợt đăng ký
   public sendForDotDangKy = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForDotDangKy', dataChange).catch((err) => console.error(err));
   };

   public receiveFromDotDangKy = (callback: any) => {
      this.hubConnection.on('ReceiveFromDotDangKy', callback);
   };

   // 10. Duyệt đề tài
   public sendForDuyetDT = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForDuyetDT', dataChange).catch((err) => console.error(err));
   };

   public receiveFromDuyetDT = (callback: any) => {
      this.hubConnection.on('ReceiveFromDuyetDT', callback);
   };

   // 11. Giảng viên
   public sendForGiangVien = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForGiangVien', dataChange).catch((err) => console.error(err));
   };

   public receiveFromGiangVien = (callback: any) => {
      this.hubConnection.on('ReceiveFromGiangVien', callback);
   };

   // 12. Giáo vụ
   public sendForGiaoVu = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForGiaoVu', dataChange).catch((err) => console.error(err));
   };

   public receiveFromGiaoVu = (callback: any) => {
      this.hubConnection.on('ReceiveFromGiaoVu', callback);
   };

   // 13. Hướng dẫn chấm
   public sendForHuongDanCham = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForHuongDanCham', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromHuongDanCham = (callback: any) => {
      this.hubConnection.on('ReceiveFromHuongDanCham', callback);
   };

   // 14. Hướng dẫn góp ý
   public sendForHuongDanGopY = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForHuongDanGopY', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromHuongDanGopY = (callback: any) => {
      this.hubConnection.on('ReceiveFromHuongDanGopY', callback);
   };

   // 15. Hội đồng phản biện chấm
   public sendForHoiDongPhanBienCham = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForHoiDongPhanBienCham', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromHoiDongPhanBienCham = (callback: any) => {
      this.hubConnection.on('ReceiveFromHoiDongPhanBienCham', callback);
   };

   // 16. Hội đồng phản biện nhận xét
   public sendForHoiDongPhanBienNhanXet = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForHoiDongPhanBienNhanXet', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromHoiDongPhanBienNhanXet = (callback: any) => {
      this.hubConnection.on('ReceiveFromHoiDongPhanBienNhanXet', callback);
   };

   // 17. Hội đồng phản biện
   public sendForHoiDongPhanBien = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForHoiDongPhanBien', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromHoiDongPhanBien = (callback: any) => {
      this.hubConnection.on('ReceiveFromHoiDongPhanBien', callback);
   };

   // 18. Hội đồng
   public sendForHoiDong = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForHoiDong', dataChange).catch((err) => console.error(err));
   };

   public receiveFromHoiDong = (callback: any) => {
      this.hubConnection.on('ReceiveFromHoiDong', callback);
   };

   // 19. Hướng dẫn
   public sendForHuongDan = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForHuongDan', dataChange).catch((err) => console.error(err));
   };

   public receiveFromHuongDan = (callback: any) => {
      this.hubConnection.on('ReceiveFromHuongDan', callback);
   };

   // 20. Kế hoạch
   public sendForKeHoach = (dataChange: boolean) => {
      this.hubConnection.invoke('sendForKeHoach', dataChange).catch((err) => console.error(err));
   };

   public receiveFromKeHoach = (callback: any) => {
      this.hubConnection.on('ReceiveFromKeHoach', callback);
   };

   // 21. Khoa
   public sendForKhoa = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForKhoa', dataChange).catch((err) => console.error(err));
   };

   public receiveFromKhoa = (callback: any) => {
      this.hubConnection.on('ReceiveFromKhoa', callback);
   };

   // 22. Lời mời
   public sendForLoiMoi = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForLoiMoi', dataChange).catch((err) => console.error(err));
   };

   public receiveFromLoiMoi = (callback: any) => {
      this.hubConnection.on('ReceiveFromLoiMoi', callback);
   };

   // 23. Nhiệm vụ
   public sendForNhiemVu = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForNhiemVu', dataChange).catch((err) => console.error(err));
   };

   public receiveFromNhiemVu = (callback: any) => {
      this.hubConnection.on('ReceiveFromNhiemVu', callback);
   };

   // 24. Nhóm
   public sendForNhom = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForNhom', dataChange).catch((err) => console.error(err));
   };

   public receiveFromNhom = (callback: any) => {
      this.hubConnection.on('ReceiveFromNhom', callback);
   };

   // 25. Phản biện chấm
   public sendForPhanBienCham = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForPhanBienCham', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromPhanBienCham = (callback: any) => {
      this.hubConnection.on('ReceiveFromPhanBienCham', callback);
   };

   // 26. Phản biện nhận xét
   public sendForPhanBienNhanXet = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForPhanBienNhanXet', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromPhanBienNhanXet = (callback: any) => {
      this.hubConnection.on('ReceiveFromPhanBienNhanXet', callback);
   };

   // 27. Phản biện
   public sendForPhanBien = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForPhanBien', dataChange).catch((err) => console.error(err));
   };

   public receiveFromPhanBien = (callback: any) => {
      this.hubConnection.on('ReceiveFromPhanBien', callback);
   };

   // 28. Ra đề
   public sendForRaDe = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForRaDe', dataChange).catch((err) => console.error(err));
   };

   public receiveFromRaDe = (callback: any) => {
      this.hubConnection.on('ReceiveFromRaDe', callback);
   };

   // 29. Sinh viên
   public sendForSinhVien = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForSinhVien', dataChange).catch((err) => console.error(err));
   };

   public receiveFromSinhVien = (callback: any) => {
      this.hubConnection.on('ReceiveFromSinhVien', callback);
   };

   // 30. Tham gia hội đồng
   public sendForThamGiaHoiDong = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForThamGiaHoiDong', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromThamGiaHoiDong = (callback: any) => {
      this.hubConnection.on('ReceiveFromThamGiaHoiDong', callback);
   };

   // 31.Tham gia
   public sendForThamGia = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForThamGia', dataChange).catch((err) => console.error(err));
   };

   public receiveFromThamGia = (callback: any) => {
      this.hubConnection.on('ReceiveFromThamGia', callback);
   };

   // 32. Thông báo
   public sendForThongBao = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForThongBao', dataChange).catch((err) => console.error(err));
   };

   public receiveFromThongBao = (callback: any) => {
      this.hubConnection.on('ReceiveFromThongBao', callback);
   };

   // 33. Trưởng bộ môn
   public sendForTruongBoMon = (dataChange: boolean) => {
      this.hubConnection
         .invoke('SendForTruongBoMon', dataChange)
         .catch((err) => console.error(err));
   };

   public receiveFromTruongBoMon = (callback: any) => {
      this.hubConnection.on('ReceiveFromTruongBoMon', callback);
   };

   // 34. Trưởng khoa
   public sendForTruongKhoa = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForTruongKhoa', dataChange).catch((err) => console.error(err));
   };

   public receiveFromTruongKhoa = (callback: any) => {
      this.hubConnection.on('ReceiveFromTruongKhoa', callback);
   };

   // 35. Vai trò
   public sendForVaiTro = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForVaiTro', dataChange).catch((err) => console.error(err));
   };

   public receiveFromVaiTro = (callback: any) => {
      this.hubConnection.on('ReceiveFromVaiTro', callback);
   };

   // 36. Xác nhận
   public sendForXacNhan = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForXacNhan', dataChange).catch((err) => console.error(err));
   };

   public receiveFromXacNhan = (callback: any) => {
      this.hubConnection.on('ReceiveFromXacNhan', callback);
   };

   // 37. Điểm đề tài
   public sendForDeTaiDiem = (dataChange: boolean) => {
      this.hubConnection.invoke('SendForDeTaiDiem', dataChange).catch((err) => console.error(err));
   };

   public receiveFromDeTaiDiem = (callback: any) => {
      this.hubConnection.on('ReceiveFromDeTaiDiem', callback);
   };

   // 37. Gặp mặt hướng dẫn
   public sendForGapMatHd = (dataChange: boolean) => {
      this.hubConnection.invoke('sendForGapMatHd', dataChange).catch((err) => console.error(err));
   };

   public ReceiveFromGapMatHd = (callback: any) => {
      this.hubConnection.on('ReceiveFromGapMatHd', callback);
   };
}
