/**
 * Created by dunklesToast on 17.07.2017.
 */
const express = require('express');
const router = express.Router();
const session = require('express-session');
const db = require('../Database');

router.get('/', function (req, res, next) {
    if (req.session.user) {
        //TODO change > to <
        if (Date.now() < 1500750000000) {
            res.render('dashboard', {mobile: req.isMobile});
            return;
        }
    } else {
        res.render('index', {mobile: req.isMobile});
        return;
    }
    let sess = req.session;
    if (sess.user) {
        db.getAliveUsers().then((aliveUsers) => {
            if (aliveUsers.length == 1) {
                res.render('finished', {winner: aliveUsers[0].full, mobile: req.isMobile});
                return;
            } else {
                //res.render('dashboard');
                db.getUser(sess.rid).then((data) => {
                    console.log(data);
                    if (data.victim) {
                        console.log('passed data.victim test');
                        db.getUser(data.victim).then((victimsData) => {
                            res.render('gameDashboard', {
                                user: {
                                    username: req.session.user,
                                    alive: !data.death,
                                    victim: victimsData.full
                                }
                            })
                        });
                    } else {
                        db.getUser(data.killed_by).then((killedByData) => {
                            res.render('gameDashboard', {
                                user: {
                                    username: req.session.user,
                                    alive: !data.death,
                                    victim: false,
                                    killed_by: killedByData.full
                                },
                                mobile: req.isMobile
                            })
                        });
                    }
                })
            }
        });

    } else {
        res.status(403);
        res.setHeader('Content-Type', 'text/html');
        res.write('Please login first');
        res.write('<meta http-equiv="refresh" content="0; URL=/">');
        res.end()
    }
});

module.exports = router;