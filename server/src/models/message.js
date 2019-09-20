import _ from 'lodash'
import {ObjectID} from 'mongodb'



export default class Message {
    constructor(app){
        this.app = app;
    }

    getMessagesByChat(id){
        const db = this.app.db

        const chatId = id.toString();

        return new Promise((resolve, rejects) => {
      
            db.collection('messages').find({chatId: chatId}).toArray((err, result) => {
               if(err){
                   return reject(err)
               }

               return resolve(result)
            })

        })
    }

    saveMessage(data){
        const db = this.app.db
        return new Promise((resolve, reject) => {
            db.collection('messages').insertOne(data, (err, info) => {
                if(err){
                    return reject(err)
                }

                return resolve(data)
            })
        })
    }
}