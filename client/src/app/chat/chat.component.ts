import { Component, OnInit,OnDestroy } from '@angular/core';
import { ChatService }       from './chat.service';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;
  
  constructor(private chatService:ChatService) {}

  sendMessage(){
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this.chatService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }
  
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
