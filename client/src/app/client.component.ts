import { Component } from '@angular/core';
import { ChatComponent } from './chat';

@Component({
  moduleId: module.id,
  selector: 'client-app',
  templateUrl: 'client.component.html',
  styleUrls: ['client.component.css'],
  directives: [ChatComponent]
})
export class ClientAppComponent {
  join = false;
  
  joinChat(){
    this.join = !this.join;
  }
  
}
