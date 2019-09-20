import {MongoClient} from 'mongodb'

const URL = 'mongodb+srv://admin:admin@cluster0-jfwxa.mongodb.net/test?retryWrites=true&w=majority'

export default class Database{
    constructor(){

    }

    connect(){
        return new Promise((resolve, reject) => {
            MongoClient.connect(URL, { useNewUrlParser: true }, (err, db) => {
                return err ? reject(err) : resolve(db);
             })
        })

    }
}