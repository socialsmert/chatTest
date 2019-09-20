import _ from 'lodash'
import { reverse } from '../tools';

export default class Bot {
    constructor(app){
        this.app = app;
    }

    create(bot){
        const db = this.app.db;
        return new Promise((resolve, reject) => {


                db.collection('bots').insertOne(bot, (err, info) => {
                    if(err){
                        return reject({error : "Error saving user"})
                    }

                    return resolve(bot);
                   
                })
        

        })
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
                    this.app.models.chat.createChat(id).then((chat) => {
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

    defineBot(message){
        return new Promise((resolve, reject) => {

            if(message.receiverId == '5d8248ce669601330826e2b7'){
                _.unset(message, '_id');
                message.receiverId = message.ownerId;
                message.name = 'Echo Bot'
                this.app.models.message.saveMessage(message).then((result) => {
                    return resolve(result)
                })   
            }else if(message.receiverId == '5d8248dc669601330826e2b8'){
                _.unset(message, '_id');
                message.receiverId = message.ownerId;
                message.name = 'Reverse Bot';
                message.message = reverse(message.message);
                this.app.models.message.saveMessage(message).then((result) => {
                    return resolve(result)
                })   
            }else if(message.receiverId == '5d8248bf669601330826e2b6'){
                _.unset(message, '_id');
                message.receiverId = message.ownerId;
                message.name = 'Spam Bot';
                message.message = 'Spam message';
                this.app.models.message.saveMessage(message).then((result) => {
                    return resolve(result)
                })   
         

               
            }
            
        })
    }

    getBots(){
        const db = this.app.db
        return new Promise((resolve, reject) => {

            db.collection('bots').find().toArray((err, result) => {
                if(err){
                    return reject(err)
                }

                result.map((bot) => {
                    _.unset(bot, 'password');
                })

                return resolve(result);
            })

        })
    }
}