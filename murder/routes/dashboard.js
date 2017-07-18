/**
 * Created by dunklesToast on 17.07.2017.
 */
const express = require('express');
const router = express.Router();
const session = require('express-session');


router.get('/', function(req, res, next) {
    console.log(req.session);
    let sess = req.session;
    if(sess.user){
        //res.render('dashboard');
        res.render('gameDashboard', {user: {username: req.session.user}})
    }else {
        res.status(403);
        res.setHeader('Content-Type', 'text/html');
        res.write('Please login first');
        res.write('<meta http-equiv="refresh" content="1; URL=/">');
        res.end()
    }
});

module.exports = router;