/**
 * Created by dunklesToast on 16.07.2017.
 */
const express = require('express');
const router = express.Router();
const session = require('express-session');

const Database = require('../Database');

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/mail', (req, res, next) => {
   if(req.body){
       Database.checkLoginMail(req.body.mail, req.body.hash).then((valid, user) => {
           if(valid){
               let sess;
               sess = req.session;
               sess.user = user.username;
               sess.is = user.id;
               res.sendStatus(200);
           }else {
               res.sendStatus(403);
           }
       }).catch((err) => {
           res.sendStatus(500);
       })
   }
});

router.post('/user', (req, res, next) => {
    if(req.body){
        Database.checkLoginUser(req.body.username, req.body.hash).then((result) => {
            if(result){

                console.log(typeof result);
                let sess = req.session;
                sess.user = result.username;
                sess.id = result.id;
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

// Access the session as req.session
router.get('/test', function(req, res, next) {
    res.render('test');
})


module.exports = router;