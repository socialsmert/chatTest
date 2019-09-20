import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any
  readonly uri: string = 'http://localhost:3000'

  constructor() {
    this.socket = io.connect(this.uri);
  }

  listen(eventName: string) {
    return new Observable<any>((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data)
      })
    })
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

 

}
