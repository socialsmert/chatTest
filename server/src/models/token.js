import jwt from 'jsonwebtoken'


export default class Token{
    constructor(app){
        this.app = app
    }

    create(data){

        const db = this.app.db;

        return new Promise((resolve, reject) => {
            jwt.sign({data}, 's65f4hj45154efvkc4', (err, token) => {
                if(err){
                    return reject(err);
                }

                const jwtToken = {
                    token: token
                }

                    db.collection('tokens').insertOne(jwtToken, (err, info) => {
                        if(err) {
                            return reject(err);
                        }

                        return resolve(info);
                    })
    
                    return resolve(token);

            })
        })
        
    }

}
