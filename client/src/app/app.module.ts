import {NgModule} from '@angular/core';
import {ClientAppComponent} from './client.component';
import {ChatComponent} from './chat/chat.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ClientAppComponent, ChatComponent],
  bootstrap: [ClientAppComponent],
  imports: [BrowserModule, FormsModule]      
})

export class AppModule {}