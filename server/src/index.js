import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import IO from 'socket.io';
import AppRouter from './app.router';
import Model from './models';
import Database from './database';
import socketioJwt from 'socketio-jwt';
import _ from 'lodash'


const PORT = 3000;
const app = express();
app.server = http.createServer(app);



app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.set('root', __dirname);

app.models = new Model(app);

app.routers = new AppRouter(app);


new Database().connect().then((db) => {
    app.db = db.db('chatapp');

    const io = IO.listen(app.server);
    app.models.socket.socketService(io);


}).catch((err) => {
    throw(err);
})




app.server.listen(process.env.PORT || PORT, () => {
    console.log(`App is running on port ${app.server.address().port}`);
});


export default app;