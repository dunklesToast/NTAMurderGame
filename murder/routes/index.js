/**
 * Created by dunklesToast on 16.07.2017.
 */
const express = require('express');
const router = express.Router();
const session = require('express-session');

const Database = require('../Database');

router.get('/', function(req, res, next) {
    console.log(req.session.user)
    if(!req.session.user) res.render('index');
    else res.redirect('/dash')
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.render('index');
});

router.post('/mail', (req, res, next) => {
   if(req.body){
       Database.checkLoginMail(req.body.mail, req.body.hash).then((result) => {
           if(result){
               console.log(typeof result);
               let sess = req.session;
               sess.user = result.username;
               sess.rid = result.id;
               console.log(req.session);
               res.sendStatus(200);
           }else {
               res.sendStatus(403);
           }
       }, (rejectReason) => {
           res.sendStatus(500);
           throw rejectReason;
       }).catch((err) => {
           res.sendStatus(500);
           console.log(err.message);
       })
   }
});

router.post('/user', (req, res, next) => {
    if(req.body){
        console.log('::CHECKING USER::');
        Database.checkLoginUser(req.body.username, req.body.hash).then((result) => {
            if(result){
                console.log('::LOGIN SUCCEEDED::');
                console.log(typeof result);
                let sess = req.session;
                sess.user = result.username;
                sess.rid = result.id;
                //console.log(req.session);
                res.sendStatus(200);
            }else {
                console.log('::LOGIN FAILED::');
                res.sendStatus(403);
            }
        }, (rejectReason) => {
            console.log('::LOGIN REJECTED::');
            res.sendStatus(500);
            throw rejectReason;
        }).catch((err) => {
            console.log('::LOGIN CATCHED::');
            res.sendStatus(500);
            console.log(err.message);
        })
    }
});

// Access the session as req.session
router.get('/test', function(req, res, next) {
    console.log('::TEST ROUTE::');
    res.render('test');
})


module.exports = router;