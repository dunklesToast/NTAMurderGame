/**
 * Created by dunklesToast on 17.07.2017.
 */
const express = require('express');
const router = express.Router();
const Database = require('../Database');

router.get('/top/:count', function (req, res, next) {
    let count = parseInt(req.params.count);
    if (isNaN(count)) {
        res.sendStatus(400);
    } else {
        let resp = [];
        Database.getTopPlayers(count).then((top) => {
            for (let i = 0; i < top.length; i++) {
                resp.push({
                    kills: top[i].kills,
                    name: top[i].name,
                    username: top[i].username,
                })
            }
            res.json(resp);
        })
    }
});

router.get('/top', function (req, res, next) {
    let resp = [];
    Database.getTopPlayer().then((top) => {
        for (let i = 0; i < top.length; i++) {
            resp.push({
                kills: top[i].kills,
                name: top[i].name,
                username: top[i].username,
            })
        }
        res.json(resp);
    })
});

router.get('/usercount', function (req, res, next) {
    Database.getUserCount().then((count) => {
        res.json({count: count});
    })
});

router.get('/start', function (req, res, next) {
   const d8 = new Date(1500927300000);
   res.json({start: d8})
});

module.exports = router;