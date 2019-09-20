import User from './user'
import Token from './token';
import Chat from './chat'
import Message from './message'
import Bot from './bot'
import Socket from './socket'




export default class Model{
    constructor(app){
        this.app = app;
        this.socket = new Socket(app);
        this.user = new User(app);
        this.token = new Token(app);
        this.chat = new Chat(app);
        this.message = new Message(app);
        this.bot = new Bot(app);
    }
}