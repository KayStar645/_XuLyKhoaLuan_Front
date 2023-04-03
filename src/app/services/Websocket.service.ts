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

  // Thông báo
  public sendForThongBao = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForThongBao', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromThongBao = (callback: any) => {
    this.hubConnection.on('ReceiveFromThongBao', callback);
  };

  // Kế hoạch
  public sendForKeHoach = (dataChange: boolean) => {
    this.hubConnection
      .invoke('sendForKeHoach', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromKeHoach = (callback: any) => {
    this.hubConnection.on('ReceiveFromKeHoach', callback);
  };

  // Nhiệm vụ
  public sendForNhiemVu = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForNhiemVu', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromNhiemVu = (callback: any) => {
    this.hubConnection.on('ReceiveFromNhiemVu', callback);
  };

  // Đề tài
  public sendForDeTai = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForDeTai', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromDeTai = (callback: any) => {
    this.hubConnection.on('ReceiveFromDeTai', callback);
  };

  // Sinh viên
  public sendForSinhVien = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForSinhVien', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromSinhVien = (callback: any) => {
    this.hubConnection.on('ReceiveFromSinhVien', callback);
  };

  // Giảng viên
  public sendForGiangVien = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForGiangVien', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromGiangVien = (callback: any) => {
    this.hubConnection.on('ReceiveFromGiangVien', callback);
  };

  // Tham gia
  public sendForThamGia = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForThamGia', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromThamGia = (callback: any) => {
    this.hubConnection.on('ReceiveFromThamGia', callback);
  };

  // Duyệt đề tài
  public sendForDuyetDT = (dataChange: boolean) => {
    this.hubConnection
      .invoke('SendForDuyetDT', dataChange)
      .catch((err) => console.error(err));
  };

  public receiveFromDuyetDT = (callback: any) => {
    this.hubConnection.on('ReceiveFromDuyetDT', callback);
  };
}
