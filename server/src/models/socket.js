import socketioJwt from 'socketio-jwt';

export default class Socket{
    constructor(app){
        this.app = app
    }

    socketService = (io) => {
    io.on('connection', socketioJwt.authorize({
        secret: 's65f4hj45154efvkc4',
        timeout: 15000
    })).on('authenticated', (socket) => {
        let socketUser;
    
        socket.on('getUser', (data) => {
            this.app.models.user.findById(data).then(user => {
                socket.emit('user', user)
            }).catch(err => {
                console.log(err);
            })
        })
    
        socket.on('online' , (data) => {
            socketUser = data;
                this.app.models.user.markStatus(data, 'true').then((result) => {
            });
        })
        
    
        socket.on('getContacts', (data) => {
            let contacts = [];
            this.app.models.user.getContacts(data).then((data) => {
                contacts[0] = data;
                this.app.models.bot.getBots().then((bots) => {
                    contacts[1] = bots
                    let allContacts = contacts[0].concat(contacts[1])
                    socket.emit('contacts', allContacts)
                })
                
            }).catch(err => {
                console.log(err);
            })
        })
        
    
        socket.on('openChat', (data) => {
            socket.leave(data[0])
            this.app.models.chat.checkIfChat(data[1]).then((chat) => {
                socket.emit('chat', chat)
                socket.join(chat.chatId)
            });
            
        })
    
        socket.on('openBotChat', (data) => {
            socket.leave(data[0])
            this.app.models.bot.checkIfChat(data[1]).then((chat) => {
                socket.emit('chat', chat)
                socket.join(chat.chatId)
            })
        })
    
        socket.on('sendBotMessage', (data) => {
            this.app.models.message.saveMessage(data).then((message) => {
                io.in(data.chatId).emit('newMessage', message);
                message.ownerId = message.receiverId;
                console.log(message);
                this.app.models.bot.defineBot(message).then((message) => {
                    io.in(data.chatId).emit('newMessage', message)
                })
            })
            
        })
        
    
        socket.on('sendMessage', (data) => {
            this.app.models.message.saveMessage(data).then((message) => {
                io.in(data.chatId).emit('newMessage', message)
            })      
        })
    
        socket.on('disconnect', () => {
            this.app.models.user.markStatus(socketUser, 'false')
        })
    })
}
}