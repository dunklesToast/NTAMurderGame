/**
 * Created by dunklesToast on 16.07.2017.
 */
const express = require('express');
const router = express.Router();
const db = require('../Database');

router.get('/', function (req, res, next) {
    res.render('register');
});


router.post('/', function (req, res, next) {
    if (req.body) {
        if (req.body.username && req.body.password && req.body.passwordc && req.body.full && req.body.tos && req.body.mail) {
            req.body.mail = req.body.mail.toString().toLowerCase();
            db.checkIfMailIsRegistered(req.body.mail).then((registered) => {
                db.checkIfUsernameIsRegistered(req.body.username).then((usernamereg) => {
                    if (!registered) {
                        if (!usernamereg) {
                            req.body.kills = 0;
                            req.body.victim = null;
                            db.insertIntoMurder(req.body).then((result) => {
                                if (result.inserted == 1) {
                                    res.sendStatus(200);
                                } else {
                                    res.sendStatus(500);
                                }
                            }).catch((err) => {
                                console.log('err: ' + err);
                                res.sendStatus(500);
                            });
                        } else {
                            res.sendStatus(777);
                        }
                    } else {
                        res.sendStatus(666);
                    }
                })
            })
        } else {
            res.sendStatus(400);
        }

    } else {
        res.sendStatus(400);
    }
});


module.exports = router;