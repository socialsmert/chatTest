import _ from 'lodash'
import {isEmail} from '../tools';
import bcrypt from 'bcrypt';
import {ObjectID} from 'mongodb'

const saltRound = 10;

export default class User {
    constructor(app){
        this.app = app;
    }

    verify(data, callback = () => {}){
        let errors = [];
        const fields = ['name', 'email', 'password', 'picture', 'online'];
        const validations = {
            name: {
                errorMessage: 'Name is required',
                do: () => {
                    const name = _.get(data, 'name', '');
                    return name.length;
                }
            },
            email: {
                errorMessage: 'Email is required',
                do: () =>{
                    const email = _.get(data, 'email', '');
                    if(!email.length || !isEmail(email)){
                        return false;
                    }

                    return true;

                }
            },
            password: {
                errorMessage: 'Password is required and more than 3 charecters',
                do: () => {
                    const password = _.get(data, 'password', '');

                    if(!password.length || password.length < 3){
                        return false
                    }

                    return true;
                }
            },
            picture: {
                errorMessage: 'Picture is required',
                do: () => {
                    const picture = _.get(data, 'picture', '');

                    if(!picture.length){
                        return false
                    }

                    return true;
                }
            },
            online: {
                errorMessage: 'Online is required',
                do: () => {
                    const online = _.get(data, 'online', '');

                    if(!online.length){
                        return false
                    }

                    return true
                } 
            }
        }

        fields.map((field) => {
            const fieldValidation = _.get(validations, field);

            if(fieldValidation){
                const isValid = fieldValidation.do();

                const error = fieldValidation.errorMessage;

                if(!isValid){
                    errors.push(error)
                }
            }
        });

        if(errors.length){
            const err = _.join(errors, ', ');
            return callback(err, null);
        }

        const email = _.toLower(_.trim(_.get(data, 'email', '')));
        const name = _.trim(_.get(data, 'name', ''));
        this.app.db.collection('users').findOne({email: email}, (err, result) => {
            if(err || result){
                return callback({message: "Email is already exist"}, null)
            }
            this.app.db.collection('users').findOne({name: name}, (err, result) => {
                if(err || result){
                    return callback({message: "Name is already exist"}, null)
                }

                const password = _.get(data, 'password');
                const hashPassword = bcrypt.hashSync(password, saltRound);

                const dataFormatted = {
                    name: name,
                    email: email,
                    password: hashPassword,
                    picture: `${_.get(data, 'picture')}`,
                    online: `${_.get(data, 'online')}`,
                    created: new Date()
                }

                return callback(null, dataFormatted);
            })
        })

        
    }

    create(data){
        const db = this.app.db;
        return new Promise((resolve, reject) => {

            this.verify(data, (err, user) => {

                if(err){
                    return reject(err);
                }

                db.collection('users').insertOne(user, (err, info) => {
                    if(err){
                        return reject({error : "Error saving user"})
                    }

                    return resolve(user);
                   
                })
            })

        })
    }

    login(data){
        const email = _.toLower(_.get(data, 'email', ''));
        const password = _.get(data, 'password', '');

        return new Promise((resolve, reject) => {
            if(!password || !email || !isEmail(email)){
                return reject({message: "An error login"})
            }

            this.findByEmail(email, (err, result) => {
                if(err){
                    return reject({message: "Login error"})
                }

                const hashPassword = _.get(result, 'password');
                const isMatch = bcrypt.compareSync(password, hashPassword);
                if(!isMatch){
                    return reject({message: "Login error"})
                }

                this.app.models.token.create(result).then((token) => {
                    _.unset(result, 'password')
                    const loginObject = {
                        user: result,
                        token: token
                    }
                    return resolve(loginObject);
                }); 
            })
        })
    } 

    findById(id){
        const db = this.app.db;
        return new Promise((resolve, reject) => {
            db.collection('users').findOne({_id: ObjectID(id)}, (err, user) => {
                if(err){
                    return reject(err)
                }

                _.unset(user, 'password')
                return resolve(user);
            })
        })
    }

    getContacts(id){
        const db = this.app.db
        return new Promise((resolve, reject) => {
            db.collection('users').find({_id: { $ne: ObjectID(id)}}).toArray((err, result) => {
                if(err){
                    return reject(err)
                }

                result.map((contact) => {
                    _.unset(contact, 'password');
                })

                return resolve(result);
            })
        })
    }





    findByEmail(email, callback = () => {}){
        this.app.db.collection('users').findOne({email: email}, (err, result) => {
            if(err || !result){
                return callback({message: "User not found"})
            }

            return callback(null, result);
        })
    }

    markStatus(id, value){
        const db = this.app.db;
        return new Promise((resolve, reject) => {
            db.collection('users').updateOne({_id: ObjectID(id)}, {$set: { online: value}}, (err, result) => {
                if(err){
                    return reject(err)
                }
                return resolve(result);
            })
        })
    }


}
