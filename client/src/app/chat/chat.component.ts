import { Component, OnInit,OnDestroy } from '@angular/core';
import { IO } from './../subjects/socket-io';
import { ioEvent } from './../subjects/io-event';

@Component({
  selector: 'chat-component',
  template: `<div *ngFor="let message of messages">
              {{message.text}}
             </div>
             <input [(ngModel)]="message" /><button (click)="sendMessage()">Send</button>
             <button (click)="connect()">{{connected ? 'Disconnect' : 'Connect'}}</button>`,
  providers: [IO]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;
  onJoin: ioEvent;
  onMessage: ioEvent;

  constructor(private socket:IO) {
    this.onJoin = new ioEvent({name: 'on-join', once: false});
    this.onMessage = new ioEvent({name: 'message', once: false});
    socket.listenToEvent(this.onJoin);
  }
  public get connected() { return this.socket.connected; }
  public connect() {
    this.socket.connect();
  }

  sendMessage(){
    let message = {text: this.message, type: 'new-message'};
    this.socket.emit('add-message', message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.socket.event$.subscribe(socketState => {
      console.log(`socket state changed:`, socketState)
    });

    this.onMessage.event$.subscribe((message) => {
      console.log(message);
      this.messages.push(message);
    });

    this.onJoin.event$.subscribe(eventData => {
      console.log('user',eventData.data,'has joined');
    })

  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
