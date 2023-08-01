import express from 'express';
import handlebars from 'express-handlebars';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Server } from 'socket.io';
import { productsUpdated, chat } from './utils/socketUtils.js';
import displayRoutes from 'express-routemap';
import mongoose from 'mongoose';
import flash from 'connect-flash';

import __dirname from './utils/utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'
import MONGO from './utils/mongoDBconfig.js';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
// import  { SECRET_D } from './utils/adminConfig.js'
const PORT = 8080;

//Commander config
const command = new Command();
command
    .option('-e, --env <env>', 'Environment', 'development')
    .parse(process.argv);

const options = command.opts();
process.env.NODE_ENV = options.env;

// const PORT = mongoDBConfig.PORT;

//Express middlewares config
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());

//Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Public folder config
app.use('/files', express.static(path.join(__dirname, './public')));

//Routes
app.use('/api/alive', (req, res) => {
    res.status(200).json({ status: 1, message: ' backend is alive' });
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

// db
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

//Session config
app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl: 3600
  }),
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

//Passport config
initializePassport(passport);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




const serverHttp = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Backend server is now up on port ${PORT}`)
});


const io = new Server(serverHttp);

app.set('io', io);

io.on('connection', socket => {
    console.log('New client connected', socket.id);
    productsUpdated(io);
    chat(socket, io);
});