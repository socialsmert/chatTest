import _ from 'lodash'
import jwt from 'jsonwebtoken'
import checkAuth from './middleware/checkAuth'

export default class AppRouter{

    constructor(app){
        this.app = app;
        this.setupRouter = this.setupRouter.bind(this);
        this.setupRouter();
    }

    setupRouter(){
        const app = this.app;
        console.log('App router works!');

        app.post('/api/user/create', (req, res, next) => {
            const body = req.body;
            
            app.models.user.create(body).then((user) => {
                _.unset(user, 'password');
                return  res.status(200).json(user)
            }).catch(err => {
                return  res.status(503).json({error: err})
            });
     
        })


        app.post('/api/user/login', (req, res, next) => {
            const body = req.body;
            app.models.user.login(body).then((loginObject) => {
                const data = {
                    success: true,
                    loginObject
                }
                return res.status(200).send(data);
            }).catch(err => {
                const data = {
                    success: false,
                    message: err
                }
                return res.send(data);
            })
        })

        app.get('/api/user/find/:id', checkAuth, (req, res, next) => {
            const id = req.params['id'];
            app.models.user.findById(id).then(user => {
                return res.status(200).json(user)
            })
        })

        app.post('/api/bots/create', (req, res, next) => {
            const body = req.body
            app.models.bot.create(body).then((bot) => {
                return res.status(200).json(bot)
            })
        })

        app.get('/auth', checkAuth, (req, res, next) => {
            return res.status(200).json({ok: true})
        })

    

        
        
    }

}