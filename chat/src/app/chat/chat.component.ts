import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'
import { ChatService } from '../chat.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})

export class ChatComponent implements OnInit {

  name: string
  messageArray: Array<any> = []
  contacts: Array<any> = []
  contactsDuplicate:  Array<any> = []
  contactsOnline:  Array<any> = []
  contactsOnlineDuplicate: Array<any> = []
  messageValue: string = ''
  chatId: string = ''
  searchValue: string = ''
  opponentName: string = 'Select chat'
  opponentPicture: string = 'https://i.stack.imgur.com/l60Hf.png'
  receiverId: string = ''
  isBot: boolean

  constructor(private http: HttpClient, 
              private auth: AuthService,
              private chatService: ChatService,
              private router: Router) { }

  ngOnInit() {

    this.chatService.listen("connect").subscribe((socket) => {
      this.chatService.listen("authenticated").subscribe(() => {
        this.chatService.emit('online', localStorage.id);
        this.chatService.emit('getContacts', localStorage.id);
        this.chatService.emit('getUser', localStorage.id);
        this.refreshOnline();
      })
      this.chatService.emit("authenticate", {token: localStorage.token});
    })

   

    this.chatService.listen("user").subscribe((data) => {
      this.name = data.name
    })
    

    this.chatService.listen("newMessage").subscribe((data) => {
      if(data.ownerId == localStorage.id){
        data.owner = true;
        console.log(data.owner)
      }else{
        data.owner = false;
      }
      this.messageArray.push(data);
    })

    this.chatService.listen("contacts").subscribe((data) => {
      this.contacts = data;
      this.contactsDuplicate = data;
      this.showOnline()
      this.searchContact() 
    })

    this.chatService.listen("chat").subscribe((data) => {
      this.messageArray = data.messages
      this.messageArray.map((message) => {
          if(message.ownerId == localStorage.id){
            message.owner = true;
          }else{
            message.owner = false
          }
      })
      console.log(this.messageArray)
      this.chatId = data.chatId
    })
  }

  openChat(id, name, picture, isbot = false){
    this.isBot = isbot;
    console.log(this.isBot);
    this.messageArray = [];
    this.messageValue = '';
    this.opponentName = name;
    this.opponentPicture = picture;
    this.receiverId = id;
      if(this.isBot == true){
        this.chatService.emit('openBotChat', [ this.chatId, [id, localStorage.id]])
      }else{
        this.chatService.emit('openChat', [ this.chatId, [id, localStorage.id]])
      }
      this.scrollChat();

    }


    scrollChat(){
      setTimeout(() => {
        let objDiv = document.getElementById("message-area-id");
        objDiv.scrollTop = objDiv.scrollHeight;
      }, 300);
    }

  sendMessage(chatId = this.chatId){
    const message = this.messageValue.trim();
    if(message !== ''){
      if(this.isBot){
        this.chatService.emit('sendBotMessage', {chatId: chatId, message: message, receiverId: this.receiverId, ownerId: localStorage.id, name: this.name})
      }else{
        this.chatService.emit('sendMessage', {chatId: chatId, message: message, receiverId: this.receiverId, ownerId: localStorage.id, name: this.name})
      }
      this.messageValue = ''
      this.scrollChat();
    }
  }

  sendBotMessage(chatId = this.chatId){
    const message = this.messageValue.trim();
    if(message !== ''){
      this.chatService.emit('sendBotMessage', {chatId: chatId, message: message, receiverId: this.receiverId, ownerId: localStorage.id, name: this.name})
      this.messageValue = ''
    }
  }

  sendMessageByEnter(event){
    if (event.key === "Enter") {
      this.sendMessage();
    }
  }


  refreshOnline(){
    setInterval( (() => {
      this.chatService.emit('getContacts', localStorage.id);
    }), 2000);
  }

  searchContact(query: string = this.searchValue, contacts:  Array<any> = this.contacts, online:  Array<any> = this.contactsOnline){
    let searchResult: Array<any> = [];
    let searchResultOnline : Array<any> = [];
    contacts.map((contact) => {
      if(contact.name.toLowerCase().search(query.toLowerCase()) == 0){
        searchResult.push(contact);
      }      
    })

    online.map((contact) => {
      if(contact.name.toLowerCase().search(query.toLowerCase()) == 0){
        searchResultOnline.push(contact);
      }      
    })
    this.contactsDuplicate = searchResult;
    this.contactsOnlineDuplicate = searchResultOnline;
  }

  showOnline(contacts:  Array<any> = this.contacts){

    let searchResult: Array<any> = [];
    contacts.map((contact) => {
      if(contact.online.search("true") == 0){
        searchResult.push(contact);
      }
      
    })
    this.contactsOnline = searchResult;
    this.contactsOnlineDuplicate = searchResult;

  }

  contactsSwitch(flag: boolean){
    if(flag == true){
      document.getElementById('tab-online').style.background = 'white';
      document.getElementById('tab-online').style.border = 'none';
      document.getElementById('tab-all').style.background = '#f8f8f8';
      document.getElementById('tab-all').style.borderBottom = '1px solid #dddddd';
      document.getElementById('tab-all').style.borderLeft = '1px solid #dddddd';
      document.getElementById('contacts-online').style.display = 'inline-block';
      document.getElementById('contacts-all').style.display = 'none';
    }else{
      document.getElementById('tab-all').style.background = 'white';
      document.getElementById('tab-all').style.border = 'none';
      document.getElementById('tab-online').style.background = '#f8f8f8';
      document.getElementById('tab-online').style.borderBottom = '1px solid #dddddd';
      document.getElementById('tab-online').style.borderRight = '1px solid #dddddd';
      document.getElementById('contacts-all').style.display = 'inline-block';
      document.getElementById('contacts-online').style.display = 'none';
    }
  }

  
  logoutClient(){
    localStorage.clear(); 
    this.router.navigate(['chat']) 
  }

}
