import _ from 'lodash'
import {ObjectID} from 'mongodb'



export default class Chat {
    constructor(app){
        this.app = app;
    }

    checkIfChat(id){
        const db = this.app.db;
       
       
        let id1 = id.slice().reverse();
        let id2 = id;

        return new Promise((resolve, reject) => {
            db.collection('chats').findOne({$or:[{"owner": id1},{"owner": id2}]}, (err, result) => {
                if(err){

                    return reject(err)
                }
                if(!result){
                    this.createChat(id).then((chat) => {
                        return resolve({chatId: chat._id, messages : []});
                    })
                }if(result){
                    this.app.models.message.getMessagesByChat(result._id).then((messages) => {
                        return resolve({chatId:result._id, messages : messages})
                    })
                }
            })
        })
    }


    createChat(id){
        const db = this.app.db;

        const chat = {
            owner: id,
        }
        return new Promise((resolve, reject) => {
            db.collection('chats').insertOne(chat, (err, info) => {
                if(err){
                    return reject(err)
                }

                return resolve(chat);
            })
        })

    }
}