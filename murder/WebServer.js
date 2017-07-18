/**
 * Created by dunklesToast on 16.07.2017.
 */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const murder = express();
const session = require('express-session');

murder.set('views', path.join(__dirname, '/views'));
murder.set('view engine', 'pug');

murder.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
murder.use(logger('dev'));
murder.use(bodyParser.json());
murder.use(bodyParser.urlencoded({extended: false}));

murder.use(express.static(path.join(__dirname, 'public')));

// Use the session middleware
murder.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))



const index = require('./routes/index');
murder.use('/', index);

const register = require('./routes/register');
murder.use('/reg', register);

const api = require('./routes/api');
murder.use('/api', api);

const dash = require('./routes/dashboard');
murder.use('/dash', dash);

murder.listen('6012');