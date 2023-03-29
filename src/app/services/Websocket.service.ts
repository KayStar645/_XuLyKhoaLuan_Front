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

  public addMessageListener = (callback: any) => {
    this.hubConnection.on('ReceiveMessage', callback);
  };

  public sendMessage = (message: any) => {
    this.hubConnection
      .invoke('SendMessage', message)
      .catch((err) => console.error(err));
  };
}
